import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/bank');

const accountSchema = new mongoose.Schema({
  username: String,
  balance: Number
});

const Account = mongoose.model('Account', accountSchema);

// Transfer endpoint
app.post('/transfer', async (req, res) => {
  const { from, to, amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const sender = await Account.findOne({ username: from });
  const receiver = await Account.findOne({ username: to });

  if (!sender) return res.status(404).json({ error: 'Sender not found' });
  if (!receiver) return res.status(404).json({ error: 'Receiver not found' });

  if (sender.balance < amount) {
    return res.status(400).json({ error: 'Insufficient funds' });
  }

  sender.balance -= amount;
  receiver.balance += amount;

  await sender.save();
  await receiver.save();

  res.json({ message: 'Transfer complete' });
});

app.listen(3000);
