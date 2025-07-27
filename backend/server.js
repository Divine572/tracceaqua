const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const { verifyMessage } = require('ethers/lib/utils')

const app = express()
const prisma = new PrismaClient()


const PORT = process.env.PORT || 3001



// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))



// User roles configuration
const USER_ROLES = {
  admin: {
    id: 'admin',
    name: 'Administrator',
    level: 3,
    permissions: ['*']
  },
  researcher: {
    id: 'researcher',
    name: 'Researcher',
    level: 2,
    permissions: ['conservation.read', 'conservation.write', 'analytics.read']
  },
  farmer: {
    id: 'farmer',
    name: 'Farmer',
    level: 2,
    permissions: ['supply_chain.farmed.write', 'supply_chain.read']
  },
  fisherman: {
    id: 'fisherman',
    name: 'Fisherman',
    level: 2,
    permissions: ['supply_chain.wild_capture.write', 'supply_chain.read']
  },
  processor: {
    id: 'processor',
    name: 'Processor',
    level: 2,
    permissions: ['supply_chain.processing.write', 'supply_chain.read']
  },
  trader: {
    id: 'trader',
    name: 'Trader/Distributor',
    level: 2,
    permissions: ['supply_chain.distribution.write', 'supply_chain.read']
  },
  retailer: {
    id: 'retailer',
    name: 'Retailer',
    level: 2,
    permissions: ['supply_chain.retail.write', 'supply_chain.read']
  },
  consumer: {
    id: 'consumer',
    name: 'Consumer',
    level: 1,
    permissions: ['traceability.read']
  }
}

// Helper functions
function generateJWT(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function verifyJWT(token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}

async function logActivity(userId, action, resource, resourceId = null, metadata = {}, req) {
  try {
    await prisma.userActivityLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        metadata,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    })
  } catch (error) {
    console.error('Activity log error:', error)
  }
}

// Auth middleware
async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' })
  }

  try {
    const decoded = verifyJWT(token)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true }
    })

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, error: 'Invalid token' })
    }

    req.user = {
      id: user.id,
      walletAddress: user.walletAddress,
      email: user.email,
      name: user.name,
      role: USER_ROLES[user.roleId] || USER_ROLES.consumer,
      isVerified: user.isVerified
    }

    next()
  } catch (error) {
    return res.status(403).json({ success: false, error: 'Invalid or expired token' })
  }
}

// Permission middleware
function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' })
    }

    const userPermissions = req.user.role.permissions
    if (userPermissions.includes('*') || userPermissions.includes(permission)) {
      next()
    } else {
      return res.status(403).json({ 
        success: false, 
        error: `Insufficient permissions. Required: ${permission}` 
      })
    }
  }
}

// ===== AUTH ROUTES =====

// POST /api/auth/verify - Verify wallet signature and authenticate
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { address, message, signature } = req.body

    if (!address || !message || !signature) {
      return res.status(400).json({ 
        success: false, 
        error: 'Address, message, and signature are required' 
      })
    }

    // Verify signature
    const recoveredAddress = verifyMessage(message, signature)
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(400).json({ success: false, error: 'Invalid signature' })
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress: address.toLowerCase() }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: address.toLowerCase(),
          roleId: 'consumer',
          isVerified: true,
          isActive: true
        }
      })
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    // Generate token
    const token = generateJWT({ 
      userId: user.id, 
      address: user.walletAddress 
    })

    // Create session
    await prisma.userSession.create({
      data: {
        userId: user.id,
        sessionToken: token,
        walletAddress: user.walletAddress,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    })

    // Log activity
    await logActivity(user.id, 'login', 'auth', null, { method: 'wallet' }, req)

    const userData = {
      id: user.id,
      walletAddress: user.walletAddress,
      email: user.email,
      name: user.name,
      role: USER_ROLES[user.roleId],
      isVerified: user.isVerified,
      createdAt: user.createdAt
    }

    res.json({
      success: true,
      data: {
        user: userData,
        token
      },
      message: 'Authentication successful'
    })

  } catch (error) {
    console.error('Auth verification error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    })
  }
})

// GET /api/auth/me - Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    })

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' })
    }

    const userData = {
      id: user.id,
      walletAddress: user.walletAddress,
      email: user.email,
      name: user.name,
      role: USER_ROLES[user.roleId],
      isVerified: user.isVerified,
      createdAt: user.createdAt
    }

    res.json({ success: true, data: userData })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// POST /api/auth/logout - Logout user
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (token) {
      // Invalidate session
      await prisma.userSession.deleteMany({
        where: { sessionToken: token }
      })
    }

    // Log activity
    await logActivity(req.user.id, 'logout', 'auth', null, {}, req)

    res.json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// ===== USER MANAGEMENT ROUTES =====

// GET /api/users - Get all users (admin only)
app.get('/api/users', authenticateToken, requirePermission('*'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        walletAddress: true,
        email: true,
        name: true,
        roleId: true,
        isVerified: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const usersWithRoles = users.map(user => ({
      ...user,
      role: USER_ROLES[user.roleId]
    }))

    res.json({ success: true, data: usersWithRoles })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// PUT /api/users/:id/role - Update user role (admin only)
app.put('/api/users/:id/role', authenticateToken, requirePermission('*'), async (req, res) => {
  try {
    const { id } = req.params
    const { roleId } = req.body

    if (!USER_ROLES[roleId]) {
      return res.status(400).json({ success: false, error: 'Invalid role' })
    }

    const user = await prisma.user.update({
      where: { id },
      data: { roleId }
    })

    // Log activity
    await logActivity(
      req.user.id, 
      'role_update', 
      'user', 
      id, 
      { newRole: roleId, targetUser: id }, 
      req
    )

    res.json({ 
      success: true, 
      data: { 
        id: user.id, 
        role: USER_ROLES[roleId] 
      },
      message: 'Role updated successfully' 
    })
  } catch (error) {
    console.error('Update role error:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// PUT /api/users/:id/status - Update user status (admin only)
app.put('/api/users/:id/status', authenticateToken, requirePermission('*'), async (req, res) => {
  try {
    const { id } = req.params
    const { isActive } = req.body

    const user = await prisma.user.update({
      where: { id },
      data: { isActive: Boolean(isActive) }
    })

    // Log activity
    await logActivity(
      req.user.id, 
      'status_update', 
      'user', 
      id, 
      { newStatus: isActive, targetUser: id }, 
      req
    )

    res.json({ 
      success: true, 
      data: { id: user.id, isActive: user.isActive },
      message: 'User status updated successfully' 
    })
  } catch (error) {
    console.error('Update status error:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// GET /api/activity - Get activity logs (admin only)
app.get('/api/activity', authenticateToken, requirePermission('*'), async (req, res) => {
  try {
    const { page = 1, limit = 50, userId, action } = req.query
    const offset = (page - 1) * limit

    const where = {}
    if (userId) where.userId = userId
    if (action) where.action = action

    const [logs, total] = await Promise.all([
      prisma.userActivityLog.findMany({
        where,
        include: {
          user: {
            select: {
              walletAddress: true,
              name: true,
              roleId: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: parseInt(limit)
      }),
      prisma.userActivityLog.count({ where })
    ])

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Get activity error:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error)
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route not found' 
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app