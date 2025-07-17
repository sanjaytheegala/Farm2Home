import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, push, set } from 'firebase/database'
import { db } from '../firebase'
import Navbar from '../components/Navbar'
import { useTranslation } from 'react-i18next';

const FarmerDashboard = () => {
  const navigate = useNavigate()
  const [rows, setRows] = useState([{ crop: '', quantity: '', price: '' }])
  const { t } = useTranslation();

  const handleAddRow = () => {
    setRows([...rows, { crop: '', quantity: '', price: '' }])
  }

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows]
    updatedRows[index][field] = value
    setRows(updatedRows)
  }

  const handleDelete = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index)
    setRows(updatedRows)
  }

  const handleEdit = (index) => {
    alert(t('edit_clicked', { row: index + 1 }))
  }

  const handleSave = async (index) => {
    const row = rows[index]
    try {
      const newRef = push(ref(db, 'crops'))
      await set(newRef, row)
      alert(t('saved_crop', { crop: row.crop, quantity: row.quantity, price: row.price }))
    } catch (error) {
      alert(t('failed_to_save'))
      console.error(error)
    }
  }

  const goBack = () => {
    navigate(-1)
  }

  return (
    <div style={container}>
      <Navbar showEcommerce={true} />
      <h2 style={heading}>
        <span onClick={goBack} style={arrowButton}>&lt;&lt;</span>
        <span style={rainbowText}>{t('farmer_dashboard')}</span>
        <span style={arrowButton}>&gt;&gt;</span>
      </h2>

      {rows.map((row, index) => (
        <div key={index} style={rowStyle}>
          <input
            type="text"
            placeholder={t('crop')}
            value={row.crop}
            onChange={(e) => handleChange(index, 'crop', e.target.value)}
            style={input}
          />
          <input
            type="text"
            placeholder={t('quantity')}
            value={row.quantity}
            onChange={(e) => handleChange(index, 'quantity', e.target.value)}
            style={input}
          />
          <input
            type="text"
            placeholder={t('price')}
            value={row.price}
            onChange={(e) => handleChange(index, 'price', e.target.value)}
            style={input}
          />
          <button onClick={() => handleSave(index)} style={saveBtn}>{t('save')}</button>
          <button onClick={() => handleEdit(index)} style={editBtn}>{t('edit')}</button>
          <button onClick={() => handleDelete(index)} style={deleteBtn}>{t('delete')}</button>
        </div>
      ))}

      <button onClick={handleAddRow} style={addBtn}>+</button>
    </div>
  )
}

// ✅ Styles
const container = {
  paddingTop: '100px',
  backgroundColor: '#f4f4f4',
  minHeight: '100vh'
}

const heading = {
  textAlign: 'center',
  marginBottom: '30px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '36px',
  fontWeight: 'bold',
  gap: '30px'
}

const arrowButton = {
  cursor: 'pointer',
  fontSize: '20px',
  fontWeight: 'bold',
  width: '48px',
  height: '48px',
  backgroundColor: '#000',
  color: '#fff',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
}

const rainbowText = {
  animation: 'rainbow 5s linear infinite',
  background: 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
}

const rowStyle = {
  display: 'flex',
  gap: '10px',
  marginBottom: '15px',
  alignItems: 'center',
  justifyContent: 'center'
}

const input = {
  padding: '8px',
  width: '150px',
  fontSize: '16px',
  border: '1px solid #ccc',
  borderRadius: '5px'
}

const saveBtn = {
  backgroundColor: 'green',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '5px',
  cursor: 'pointer',
  color: '#fff'
}

const editBtn = {
  backgroundColor: 'skyblue',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '5px',
  cursor: 'pointer',
  color: '#000'
}

const deleteBtn = {
  backgroundColor: 'red',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '5px',
  cursor: 'pointer',
  color: '#fff'
}

const addBtn = {
  width: '50px',
  height: '50px',
  fontSize: '24px',
  fontWeight: 'bold',
  borderRadius: '50%',
  border: 'none',
  cursor: 'pointer',
  margin: '30px auto',
  display: 'block',
  animation: 'rainbow 5s linear infinite'
}

// ✅ Inject rainbow keyframes
const style = document.createElement('style')
style.textContent = `
  @keyframes rainbow {
    0% { background-color: #ff0000; }
    16% { background-color: #ff9900; }
    32% { background-color: #ffff00; }
    48% { background-color: #33cc33; }
    64% { background-color: #0099ff; }
    80% { background-color: #9900cc; }
    100% { background-color: #ff0000; }
  }
`
document.head.appendChild(style)

export default FarmerDashboard
