export const getGrade = (cgpa) => {
  if (cgpa === 4) return 'A+'
  if (cgpa >= 3.7) return 'A'
  if (cgpa >= 3.3) return 'B+'
  if (cgpa >= 3.0) return 'B'
  if (cgpa >= 2.7) return 'B-'
  if (cgpa >= 2.3) return 'C+'
  if (cgpa >= 2.0) return 'C'
  if (cgpa >= 1.7) return 'D'
  return 'F'
}

export const getCellValue = (fields, column) => {
  const isSchool = ['Matric', 'Intermediate'].includes(fields.degreeLevel)

  if (column.key === 'degreeLevel') {
    return fields.degreeLevel === 'Other' && fields.customLevel ? fields.customLevel : (fields.degreeLevel || '-')
  }
  if (column.computed === 'degree') {
    return fields.customDegree || fields.customDegreeMatric || fields.customDegreeInter || fields.degreeNameMatric || fields.degreeNameInter || fields.degreeNameHigher || '-'
  }
  if (column.computed === 'education') {
    if (isSchool) {
      return fields.obtainedMarks && fields.totalMarks
        ? `${((fields.obtainedMarks / fields.totalMarks) * 100).toFixed(2)}%`
        : '-'
    }
    return fields.cgpa ? `Grade: ${getGrade(parseFloat(fields.cgpa))}` : '-'
  }
  if (column.key === 'obtainedMarks') return isSchool ? (fields.obtainedMarks || '-') : (fields.cgpa || '-')
  if (column.key === 'totalMarks') return isSchool ? (fields.totalMarks || '-') : '4'

  return fields[column.key] || '-'
}

export default function Table({ columns = [], records = [], onEdit, onDelete, readOnly = false }) {
  if (!records.length) {
    return <p className="text-muted text-center my-2" style={{ fontSize: '0.85rem' }}>No records found</p>
  }

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-sm align-middle mb-0" style={{ fontSize: '0.8rem' }}>
        <thead className="table-light">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="py-2 px-2 text-nowrap">{col.label}</th>
            ))}
            {!readOnly && <th className="py-2 px-2 text-nowrap text-center" style={{ width: 110 }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {records.map(row => (
            <tr key={row.id}>
              {columns.map(col => (
                <td
                  key={col.key}
                  className="py-2 px-2"
                  style={col.key === 'description' || col.key === 'message' ? { minWidth: '200px', whiteSpace: 'normal' } : {}}
                >
                  {getCellValue(row.fields || {}, col)}
                </td>
              ))}
              {!readOnly && (
                <td className="py-2 px-2 text-nowrap text-center">
                  <button className="btn btn-warning me-1 py-1 px-2" style={{ fontSize: '0.7rem' }} onClick={() => onEdit(row)}>Edit</button>
                  <button className="btn btn-danger py-1 px-2" style={{ fontSize: '0.7rem' }} onClick={() => onDelete(row.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}