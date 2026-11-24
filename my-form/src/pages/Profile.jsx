import { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { updateProfile } from '../store/profileSlice'
import { setSectionsData, addRecord, updateRecord, deleteRecord } from '../store/sectionsSlice'
import { profileSchema, validateStepByStep } from '../utils/validationSchemas'
import Modal from '../components/Modal'
import Table from '../components/Table'
import CvDocument from '../components/CvDocument'
import { pdf } from '@react-pdf/renderer'

const baseFields = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter full name', col: 'col-md-6' },
  { name: 'cnic', label: 'CNIC', type: 'text', placeholder: '13-digit CNIC', maxLength: 13, col: 'col-md-6' },
  { name: 'dob', label: 'Date of Birth', type: 'date', col: 'col-md-6' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Email address', col: 'col-md-6' },
  { name: 'phoneNumber', label: 'Phone Number', type: 'text', placeholder: '03XXXXXXXXX', maxLength: 11, col: 'col-md-6' },
  { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], col: 'col-md-6' },
  { name: 'maritalStatus', label: 'Marital Status', type: 'select', options: ['Single', 'Married'], col: 'col-md-6' },
  { name: 'about', label: 'About Me', type: 'textarea', placeholder: 'Short introduction', col: 'col-md-6' },
]

const endpoints = {
  education: '/Data/education.json',
  experience: '/Data/experience.json',
  skills: '/Data/skills.json',
  recommendation: '/Data/recommendation.json'
}

export default function Profile() {
  const dispatch = useDispatch()
  const profile = useSelector(state => state.profile)
  const sections = useSelector(state => state.sections)
  const [appState, setAppState] = useState({ modal: { open: false, key: null, item: null }, isSubmitted: false })

  useEffect(() => {
    Promise.all(
      Object.entries(endpoints).map(async ([key, url]) => {
        try {
          const res = await axios.get(url)
          return [key, { ...res.data, records: res.data.records || [] }]
        } catch {
          return [key, { title: key, fields: [], columns: [], records: [] }]
        }
      })
    ).then(results => {
      dispatch(setSectionsData(Object.fromEntries(results)))
    })
  }, [dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    dispatch(updateProfile({ [name]: value }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        dispatch(updateProfile({ profilePhoto: file, profilePhotoPreview: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitForm = () => {
    const error = validateStepByStep(profileSchema, profile)
    if (error) return toast.error(error)

    const sectionsEmpty = Object.values(sections).some(sec => sec.records.length === 0)
    if (sectionsEmpty) {
      return toast.error('Please fill all sections (Education, Experience, Skills, Recommendations) before submitting.')
    }

    setAppState(prev => ({ ...prev, isSubmitted: true }))
    toast.success('Form submitted successfully!')
  }

  const handleSave = (formData) => {
    if (appState.modal.item) {
      dispatch(updateRecord({ key: appState.modal.key, id: appState.modal.item.id, fields: formData }))
      toast.success('Record updated successfully!')
    } else {
      dispatch(addRecord({ key: appState.modal.key, fields: formData }))
      toast.success('Record added successfully!')
    }
    setAppState(prev => ({ ...prev, modal: { open: false, key: null, item: null } }))
  }

  const handleDelete = (key, id) => {
    dispatch(deleteRecord({ key, id }))
    toast.info('Record deleted!')
  }

  const handleDownloadCV = async () => {
    try {
      const blob = await pdf(<CvDocument profile={profile} sections={sections} baseFields={baseFields} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${profile.name || 'User'}_CV.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('CV Downloaded Successfully!')
    } catch {
      toast.error('Failed to generate PDF')
    }
  }

  const renderInput = (field) => {
    if (field.type === 'select') {
      return (
        <select className="form-select form-select-sm" name={field.name} value={profile[field.name] || ''} onChange={handleChange}>
          <option value="">Select {field.label}</option>
          {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      )
    }
    if (field.type === 'textarea') {
      return <textarea className="form-control form-control-sm" rows="1" name={field.name} value={profile[field.name] || ''} onChange={handleChange} placeholder={field.placeholder} />
    }
    return <input type={field.type} className="form-control form-control-sm" name={field.name} value={profile[field.name] || ''} onChange={handleChange} placeholder={field.placeholder} maxLength={field.maxLength} />
  }

  return (
    <div className="container-fluid py-3 px-3 bg-light" style={{ minHeight: '100vh' }}>

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-3">
              <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Personal Information</h6>
              <div className="row g-2 mb-3">
                <div className="col-12 mb-2">
                  <label className="form-label text-dark fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>Profile Photo (PNG, JPG, JPEG)</label>
                  <input type="file" accept="image/png, image/jpeg, image/jpg" className="form-control form-control-sm" onChange={handlePhotoChange} />
                </div>
                {baseFields.map(field => (
                  <div className={field.col} key={field.name}>
                    <label className="form-label text-dark fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>{field.label}</label>
                    {renderInput(field)}
                  </div>
                ))}
              </div>

              <h6 className="fw-bold text-dark border-bottom pb-2 mb-3 mt-3">Qualifications & Details</h6>
              {Object.entries(sections).map(([key, config]) => (
                <div key={key} className="mb-3 border rounded p-2 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.9rem' }}>{config.title}</h6>
                    <button className="btn btn-primary btn-sm py-1 px-3" style={{ fontSize: '0.75rem' }} onClick={() => setAppState(prev => ({ ...prev, modal: { open: true, key, item: null } }))}>Add {config.title}</button>
                  </div>
                  <Table columns={config.columns} records={config.records} onEdit={(item) => setAppState(prev => ({ ...prev, modal: { open: true, key, item } }))} onDelete={(id) => handleDelete(key, id)} />
                </div>
              ))}

              <div className="mt-4 pt-3 border-top">
                <button type="button" className="btn btn-success w-100 fw-bold" onClick={handleSubmitForm}>Submit Form</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border-success border-2 sticky-top" style={{ top: '15px' }}>
            <div className="card-header bg-success text-white py-2 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">Form Data</h6>
              {appState.isSubmitted && <button className="btn btn-light btn-sm fw-bold" onClick={handleDownloadCV} style={{ fontSize: '0.8rem' }}>Download CV</button>}
            </div>
            <div className="card-body p-3">
              {!appState.isSubmitted ? (
                <div className="text-center text-muted py-5"><p className="mb-0">Fill out the form and click Submit to see the preview.</p></div>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <h3 className="fw-bold text-dark mb-1 mt-4">{profile.name || 'User'}</h3>
                    </div>
                    {profile.profilePhotoPreview && (
                      <img src={profile.profilePhotoPreview} alt="Profile" className="rounded-circle border border-2" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                    )}
                  </div>

                  <div className="row g-2 mb-4">
                    {baseFields.filter(f => f.name !== 'name').map(field => profile[field.name] && (
                      <div className={field.col} key={field.name}>
                        <span className="text-dark fw-semibold d-block" style={{ fontSize: '0.85rem' }}>{field.label}</span>
                        <span className="text-muted" style={{ fontSize: '0.9rem' }}>{profile[field.name]}</span>
                      </div>
                    ))}
                  </div>

                  {Object.entries(sections).map(([key, config]) => config.records?.length > 0 && (
                    <div key={key} className="mb-3">
                      <h5 className="fw-bold text-dark border-bottom pb-2 mb-2">{config.title}</h5>
                      <Table columns={config.columns} records={config.records} readOnly={true} />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {appState.modal.open && sections[appState.modal.key] && (
        <Modal title={sections[appState.modal.key].title} fields={sections[appState.modal.key].fields} initialData={appState.modal.item} sectionKey={appState.modal.key} onSave={handleSave} onClose={() => setAppState(prev => ({ ...prev, modal: { open: false, key: null, item: null } }))} />
      )}
    </div>
  )
}