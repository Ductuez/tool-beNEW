import express from 'express'
const router = express.Router()
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import { SECRET } from '../../config.js'
import { User } from '../model/user.js'

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create a new user
    const user = new User({
      email,
      password: hashedPassword,
    })

    // Save the user
    const savedUser = await user.save()

    // Generate JWT token
    const token = jwt.sign({ userId: savedUser._id, email: savedUser.email }, SECRET, {
      expiresIn: '72h',
    })

    res.json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Login route
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find the user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email, phone: user.phone }, SECRET, {
      expiresIn: '24h',
    })

    user.loggedIn = true
    await user.save()

    res.json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/logout', async (req, res) => {
  try {
    // Xử lý yêu cầu đăng xuất
    //  Cập nhật trạng thái đăng nhập của người dùng trong cơ sở dữ liệu
    const filter = { email: req.body.email } // Điều kiện tìm người dùng (thay đổi tùy thuộc vào cấu trúc dữ liệu của bạn)
    const update = { $set: { loggedIn: false } } // Cập nhật trạng thái đăng nhập
    await User.updateOne(filter, update)

    // Trả về kết quả thành công
    res.json({ status: 'success', message: 'Logout successful' })
  } catch (err) {
    console.error(err)
    // Trả về lỗi nếu có lỗi xảy ra
    res.status(500).json({ status: 'error', message: 'Internal server error' })
  }
})

export default router
