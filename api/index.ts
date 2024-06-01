import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'

export const config = {
  runtime: 'edge'
}

const app = new Hono().basePath('/api')


async function generateLogData(req) {
  const ip = req.headers.get('x-forwarded-for') || req.req.ip;
  const lat = req.headers.get('x-vercel-ip-latitude');
  const lon = req.headers.get('x-vercel-ip-longitude');
  const city = req.headers.get('x-vercel-ip-city');
  const region = req.headers.get('x-vercel-ip-country-region');
  const country = req.headers.get('x-vercel-ip-country');
  const userAgent = req.headers.get('user-agent');
  const date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

  return { ip, lat, lon, city, region, country, userAgent, date };
}

app.get('/', async (c) => {
  try {
    const logData = await generateLogData(c.req);
    c.res.headers.set('Content-Type', 'application/json');
    return c.json(logData);
  } catch (error) {
    console.error('Error generating log data:', error);
    return c.text('Internal Server Error', 500);
  }
});

// Apply CORS middleware globally with allowed methods (adjust based on your API needs)
app.use(cors({
  origin: '*',  // Allowing access from all origins (security risk for production)
  methods: 'GET, POST, PUT, DELETE, OPTIONS',  // Allow common methods
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


export default handle(app)
