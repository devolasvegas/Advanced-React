import { createProxyMiddleware } from 'http-proxy-middleware';

export const config = {
  api: {
    bodyParser: false, // Important for file uploads if using apollo-upload-client
    externalResolver: true, // Important for proxying
  },
};

const backendUrl = process.env.PRIVATE_BACKEND_URL;

export default function handler(req, res) {
  return createProxyMiddleware({
    target: backendUrl,
    changeOrigin: true,
    on: {
      error: (err) => {
        console.error('Proxy error:', err);
        res.status(500).json({ error: 'Proxy error' });
      },
    },
  })(req, res);
}
