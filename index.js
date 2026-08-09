const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ===== BRANDING =====
const BRANDING = {
  developed_by: "HJ-HACKER",
  whatsapp_channel: "https://whatsapp.com/channel/0029VbAaNJ6C1FuB0mIAx93M",
  main_site: "https://hamza-jutt-7d6.pages.dev/",
  note: "🔥 Follow HJ-HACKER for more tools, apps & tech updates!",
  version: "1.0.0"
};

// ============================================================
// ===== TRUECALLER API =====
// ============================================================

/**
 * Search Truecaller by Phone Number
 * 
 * @param {string} number - Phone number to search
 * @returns {Object} - Truecaller data
 */
app.get('/api/truecaller', async (req, res) => {
  const { number, q } = req.query;
  const phoneNumber = number || q;

  // Check if number is provided
  if (!phoneNumber) {
    return res.status(400).json({
      success: false,
      error: 'Phone number is required',
      usage: {
        by_number: '/api/truecaller?number=03001234567',
        by_q: '/api/truecaller?q=03001234567',
        with_country_code: '/api/truecaller?number=923001234567'
      },
      credits: BRANDING,
      example: '/api/truecaller?number=3035481601'
    });
  }

  try {
    const cleanNumber = phoneNumber.toString().trim();
    console.log('📞 Truecaller Search:', cleanNumber);

    // ===== CALL THE EXTERNAL TRUECALLER API =====
    const apiUrl = `https://faisal-ali-truecaller.ftgmhacks.workers.dev/?key=ftgmisking&number=${encodeURIComponent(cleanNumber)}`;
    console.log('🔄 Calling Truecaller API:', apiUrl);

    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      timeout: 15000
    });

    const data = response.data;
    console.log('✅ Truecaller Response received');

    // ===== CHECK IF DATA FOUND =====
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'No Truecaller data found for this number',
        credits: BRANDING,
        number: cleanNumber
      });
    }

    // ===== CHECK IF API RETURNED ERROR =====
    if (data.error || data.status === false) {
      return res.status(404).json({
        success: false,
        error: data.message || 'No data found for this number',
        credits: BRANDING,
        number: cleanNumber,
        details: data
      });
    }

    // ===== FORMAT RESPONSE =====
    const responseData = data.data || data;

    res.json({
      credits: BRANDING,
      status: true,
      results: {
        status: true,
        source: "Truecaller API",
        data: {
          number: cleanNumber,
          name: responseData.name || responseData.full_name || responseData.displayName || 'N/A',
          country: responseData.country || responseData.countryCode || 'N/A',
          carrier: responseData.carrier || responseData.network || 'N/A',
          location: responseData.location || responseData.city || 'N/A',
          spam: responseData.spam || responseData.isSpam || false,
          spam_reports: responseData.spamReports || responseData.spam_count || 0,
          profile_photo: responseData.photo || responseData.profilePhoto || null,
          is_verified: responseData.verified || responseData.isVerified || false,
          email: responseData.email || null,
          company: responseData.company || null
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Truecaller Error:', error.message);
    
    let errorMessage = 'Failed to fetch Truecaller data. Please try again later.';
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. The Truecaller server is taking too long to respond.';
    } else if (error.response?.status === 400) {
      errorMessage = 'Invalid number format. Please provide a valid phone number.';
    } else if (error.response?.status === 403) {
      errorMessage = 'API key is invalid or expired.';
    } else if (error.response?.status === 429) {
      errorMessage = 'Too many requests. Please try again later.';
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      credits: BRANDING,
      debug: {
        number: cleanNumber,
        error_details: error.message
      }
    });
  }
});

// ============================================================
// ===== HOME PAGE =====
// ============================================================
app.get('/', (req, res) => {
  res.json({
    name: "HJ-HACKER Truecaller API",
    version: "1.0.0",
    status: "🟢 Online",
    developer: "HJ-HACKER",
    website: "https://hamza-jutt-7d6.pages.dev/",
    whatsapp: "https://whatsapp.com/channel/0029VbAaNJ6C1FuB0mIAx93M",
    endpoints: {
      truecaller: "/api/truecaller?number=PHONE_NUMBER"
    },
    examples: {
      with_zero: "/api/truecaller?number=03001234567",
      without_zero: "/api/truecaller?number=3001234567",
      with_country_code: "/api/truecaller?number=923001234567",
      using_q: "/api/truecaller?q=03001234567"
    }
  });
});

// ============================================================
// ===== 404 HANDLER =====
// ============================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found. Available endpoint: /api/truecaller',
    credits: BRANDING,
    available_endpoints: {
      truecaller: "/api/truecaller?number=PHONE_NUMBER"
    },
    examples: {
      phone: "/api/truecaller?number=03001234567",
      phone_no_zero: "/api/truecaller?number=3001234567"
    }
  });
});

// ============================================================
// ===== START SERVER =====
// ============================================================
app.listen(PORT, () => {
  console.log(`🚀 HJ-HACKER Truecaller API running on port ${PORT}`);
  console.log(`🌐 Website: https://hamza-jutt-7d6.pages.dev/`);
  console.log(`📱 WhatsApp Channel: ${BRANDING.whatsapp_channel}`);
  console.log(`\n📌 Endpoint:`);
  console.log(`  → Truecaller:  /api/truecaller?number=03001234567`);
});
