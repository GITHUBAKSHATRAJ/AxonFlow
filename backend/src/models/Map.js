const mongoose = require('mongoose');

const MapSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  rootNodeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Node'
  },
  workspace: { type: String, default: null },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  isFavorite: { type: Boolean, default: false },
  isTrashed: { type: Boolean, default: false },
  tags: { type: [String], default: [] },
  lastAccessedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Map', MapSchema);
