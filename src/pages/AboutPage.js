import Navbar from '../components/Navbar'

const AboutPage = () => {
  return (
    <div style={container}>
      <Navbar languageSelector={2} />
      <div style={content}>
        <h1 style={heading}>About Us</h1>
        <p style={text}>
          Farm2Home is a community-driven platform designed to bridge the gap between farmers and consumers.
          Our mission is to promote local agriculture, ensure fair prices, and bring farm-fresh produce directly to consumers.
        </p>

        <h2 style={subheading}>Our Team</h2>
        <div style={teamSection}>
          {[
            { name: 'Sanjay', phone: '8688603672' },
            { name: 'Adithya', phone: '6305058346' },
            { name: 'Venkat', phone: '9849991455' }
          ].map((member, index) => (
            <div key={index} style={card}>
              <img src="https://via.placeholder.com/100" alt="Profile" style={image} />
              <h3>{member.name}</h3>
              <p>{member.phone.replace(/(\d{2})\d{6}(\d{2})/, '$1******$2')}</p>
            </div>
          ))}
        </div>

        <h2 style={subheading}>Our Project</h2>
        <p style={text}>
          Farm2Home was built to empower farmers and enable consumers to access healthy, farm-fresh food easily.
          The platform promotes direct interaction, transparency in pricing, and a sustainable food supply chain.
        </p>

        <h2 style={subheading}>Contact Us</h2>
        <p style={text}>
          Your feedback fuels our innovation. Reach us at: <strong>sanjaytheegala05@gmail.com</strong>
        </p>
      </div>
    </div>
  )
}

// ✅ Styles
const container = {
  paddingTop: '100px',
  backgroundColor: '#f4f4f4',
  minHeight: '100vh'
}

const content = {
  maxWidth: '800px',
  margin: 'auto',
  padding: '20px'
}

const heading = {
  textAlign: 'center',
  fontSize: '36px',
  marginBottom: '20px'
}

const subheading = {
  fontSize: '24px',
  marginTop: '30px',
  marginBottom: '10px'
}

const text = {
  fontSize: '18px',
  lineHeight: '1.6'
}

const teamSection = {
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '20px'
}

const card = {
  flex: '1',
  minWidth: '150px',
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  textAlign: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
}

const image = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  marginBottom: '10px'
}

export default AboutPage
