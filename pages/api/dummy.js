export default function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Received data:', req.body);
    // Simulate processing delay
    setTimeout(() => {
      res.status(200).json({ 
        success: true, 
        message: 'Operation successful',
        data: req.body
      });
    }, 1000);
  } else {
    res.status(200).json({ 
      success: true, 
      message: 'Dummy API endpoint',
      data: { example: 'This is a dummy response' }
    });
  }
}