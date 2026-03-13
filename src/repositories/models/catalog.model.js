import { Schema, model } from 'mongoose';

const catalogSchema = new Schema(
  {
    sessionId: {
      type: String,
      index: true,
      required: true,
    },
    htmlBase64: {
      type: String,
      required: true,
    },
    isExpired: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export default model('catalog', catalogSchema);
