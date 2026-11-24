import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getSchemaByKey, validateStepByStep } from '../utils/validationSchemas'

export default function Modal({ title, fields = [], initialData, sectionKey, onSave, onClose }) {
  const [form, setForm] = useState({})

  useEffect(() => {
    const initial = fields.reduce((acc, field) => {
      acc[field.name] = field.type === 'range' ? 50 : (field.defaultValue ?? '')
      return acc
    }, {})
    setForm(initialData?.fields ? { ...initial, ...initialData.fields } : initial)
  }, [fields, initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => {
      const updated = { ...prev, [name]: value }

      if (name === 'degreeLevel') {
        Object.assign(updated, {
          degreeNameMatric: '', degreeNameInter: '', degreeNameHigher: '',
          customDegree: '', customDegreeMatric: '', customDegreeInter: '',
          customLevel: '', obtainedMarks: '', cgpa: '',
          totalMarks: ['Matric', 'Intermediate'].includes(value) ? 1100 : 4
        })
      }
      if (name === 'degreeNameHigher' && value !== 'Other') updated.customDegree = ''
      if (name === 'obtainedMarks' && value !== '') updated.cgpa = ''
      if (name === 'cgpa' && value !== '') updated.obtainedMarks = ''

      return updated
    })
  }

  const shouldShow = (field) => {
    if (!field.showWhen) return true
    const { field: depField, value: expected } = field.showWhen
    const depFields = Array.isArray(depField) ? depField : [depField]
    
    return depFields.some(f => {
      const currentVal = form[f]
      return Array.isArray(expected) ? expected.includes(currentVal) : currentVal === expected
    })
  }

  const handleSaveClick = () => {
    const schema = getSchemaByKey(sectionKey)
    const error = validateStepByStep(schema, form)
    
    if (error) {
      toast.error(error)
      return
    }
    
    onSave(form)
  }

  const renderField = (field) => {
    const commonProps = { name: field.name, value: form[field.name] || '', onChange: handleChange }

    if (field.type === 'select') {
      return (
        <select className="form-select" {...commonProps}>
          <option value="">Select {field.label}</option>
          {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      )
    }
    if (field.type === 'textarea') {
      return <textarea className="form-control" rows="1" placeholder={field.placeholder} {...commonProps} />
    }
    if (field.type === 'range') {
      return (
        <div>
          <input type="range" className="form-range" min={field.min || 1} max={field.max || 100} {...commonProps} />
          <small className="text-muted">{form[field.name] || 50}%</small>
        </div>
      )
    }
    return <input type={field.type} className="form-control" placeholder={field.placeholder} {...commonProps} />
  }

  return (
    <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1040 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content" style={{ zIndex: 1050 }}>
          <div className="modal-header">
            <h5 className="modal-title">{initialData ? 'Edit' : 'Add'} {title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              {fields.map(field => shouldShow(field) && (
                <div className="col-md-6" key={field.name}>
                  <label className="form-label">{field.label}</label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleSaveClick}>Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}