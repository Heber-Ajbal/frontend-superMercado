import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

type ReporteMeta = {
  titulo: string
  subtitulo?: string
  periodo?: string
  resumen?: Array<{ label: string, value: string }>
  columnas: string[]
  filas: (string | number)[][]
  archivo: string
}

export async function exportarReportePDF(meta: ReporteMeta) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const logoBase64 = await getImageBase64('/img/full-logo.png').catch(() => null)

  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', 12, 10, 34, 20)
  }

  doc.setFontSize(18)
  doc.text(meta.titulo, 105, 18, { align: 'center' })

  doc.setFontSize(10)
  doc.setTextColor(90)
  doc.text('Sistema de Supermarket E.H.N', 105, 24, { align: 'center' })

  let currentY = 36

  if (meta.subtitulo) {
    doc.setFontSize(11)
    doc.setTextColor(60)
    doc.text(meta.subtitulo, 14, currentY)
    currentY += 6
  }

  if (meta.periodo) {
    doc.setFontSize(10)
    doc.text(`Periodo: ${meta.periodo}`, 14, currentY)
    currentY += 8
  }

  if (meta.resumen?.length) {
    autoTable(doc, {
      startY: currentY,
      theme: 'grid',
      head: [['Indicador', 'Valor']],
      body: meta.resumen.map(item => [item.label, item.value]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [30, 64, 175] }
    })

    currentY = (doc as any).lastAutoTable.finalY + 8
  }

  autoTable(doc, {
    startY: currentY,
    theme: 'striped',
    head: [meta.columnas],
    body: meta.filas,
    styles: { fontSize: 9, cellPadding: 2.5 },
    headStyles: { fillColor: [15, 23, 42] }
  })

  const pageCount = doc.getNumberOfPages()
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page)
    doc.setFontSize(9)
    doc.setTextColor(120)
    doc.text(`Página ${page} de ${pageCount}`, 196, 290, { align: 'right' })
  }

  doc.save(meta.archivo)
}

async function getImageBase64(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = reject
    img.src = path
  })
}
