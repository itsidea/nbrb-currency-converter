export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.nbrb.by/exrates/rates?periodicity=0');
    
    if (!response.ok) {
      throw new Error(`NBRB API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const TARGET_CURRENCIES = ['USD', 'EUR', 'RUB', 'TRY', 'GEL'];
    const filtered = data.filter(item => TARGET_CURRENCIES.includes(item.Cur_Abbreviation));
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');
    
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      rates: filtered
    });
    
  } catch (error) {
    console.error('Error fetching NBRB rates:', error);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch rates from NBRB',
      message: error.message
    });
  }
}