// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Nome é obrigatório'],
    trim: true,
    minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
    maxlength: [50, 'Nome deve ter no máximo 50 caracteres']
  },
  email: { 
    type: String, 
    required: [true, 'Email é obrigatório'], 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  password: { 
    type: String, 
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres']
  }
}, {
  timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

// Middleware para hash da senha antes de salvar
UserSchema.pre('save', async function(next) {
  // Só faz hash se a senha foi modificada
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senhas
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para remover senha do JSON
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Métodos básicos de CRUD
UserSchema.statics.createUser = async function(data) {
  try {
    const user = new this(data);
    return await user.save();
  } catch (error) {
    throw error;
  }
};

UserSchema.statics.findOneUser = async function(id) {
  try {
    return await this.findById(id).select('-password');
  } catch (error) {
    throw error;
  }
};

UserSchema.statics.findAllUsers = async function(filter = {}) {
  try {
    return await this.find(filter).select('-password').sort({ name: 1 });
  } catch (error) {
    throw error;
  }
};

UserSchema.statics.updateUser = async function(id, data) {
  try {
    return await this.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    }).select('-password');
  } catch (error) {
    throw error;
  }
};

UserSchema.statics.deleteUser = async function(id) {
  try {
    return await this.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
};

UserSchema.statics.findByEmail = async function(email) {
  try {
    return await this.findOne({ email });
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('User', UserSchema);