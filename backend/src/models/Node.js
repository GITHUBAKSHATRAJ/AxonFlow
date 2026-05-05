const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  title: String,
  url: String
}, { _id: false });

const FileSchema = new mongoose.Schema({
  fileName: String,
  fileUrl: String
}, { _id: false });

const NodeSchema = new mongoose.Schema({
  mapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Map',
    required: true
  },
  userId: { type: String, required: true },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Node',
    default: null
  },
  name: { type: String, required: true },
  isExpanded: { type: Boolean, default: true },
  notes: { type: [String], default: [] },
  links: { type: [LinkSchema], default: [] },
  files: { type: [FileSchema], default: [] },
  status: { type: String, default: null },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 }
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

module.exports = mongoose.model('Node', NodeSchema);
