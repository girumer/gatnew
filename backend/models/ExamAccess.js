const ExamAccessSchema = new mongoose.Schema({
  examName: {
    type: String,
    enum: ["ERMP", "NGAT"],
    required: true
  },
  depositAmount: {
    type: Number,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  }
});

// Example usage when user deposits:
function createExamAccess(examName) {
  const deposits = { ERMP: 300, NGAT: 200 };
  return {
    examName,
    depositAmount: deposits[examName],
    validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  };
}
