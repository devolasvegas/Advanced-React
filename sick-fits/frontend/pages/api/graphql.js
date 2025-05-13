export default function handler(req, res) {
  console.log('Inside /api/graphql endpoint');
  res.status(200).json({ message: 'Hello from Next.js!' });
}
