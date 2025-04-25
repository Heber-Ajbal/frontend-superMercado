import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export async function generarFacturaPDF(venta: any) {
  const doc = new jsPDF()

  console.table(venta);

  const nombreCliente = venta.Cliente || 'cliente'
  const direccionCliente = venta.Direccion || 'Dirección no disponible'
  const fecha = venta.Fecha || new Date().toISOString().slice(0, 10)

  // Cargar el logo desde public/img/logo.png
  const logoBase64 = await getImageBase64('/img/full-logo.png')

  doc.addImage(logoBase64, 'PNG', 10, 10, 30, 20)

  doc.setFontSize(18)
  doc.text('Factura', 105, 20, { align: 'center' })

  doc.setFontSize(12)
  doc.text(`Cliente: ${nombreCliente}`, 20, 40)
  doc.text(`Dirección: ${direccionCliente}`, 20, 48)
  doc.text(`Empleado: ${venta.Empleado}`, 20, 56)
  doc.text(`Fecha: ${fecha}`, 20, 64)
  doc.text(`Hora: ${venta.Hora}`, 20, 72)
  doc.text('Método de pago: Efectivo', 20, 80)

  const body = venta.Detalle.map((item: any) => [
    item.producto,
    item.cantidad,
    `$${item.precio.toFixed(2)}`,
    `$${item.descuento.toFixed(2)}`,
    `$${(item.precio * item.cantidad - item.descuento).toFixed(2)}`
  ])

  autoTable(doc, {
    startY: 90,
    head: [['Producto', 'Cantidad', 'Precio Unitario', 'Descuento', 'Subtotal']],
    body
  })

  doc.text(`Total: $${venta.Monto.toFixed(2)}`, 150, doc.lastAutoTable.finalY + 10)

  doc.save(`factura_${nombreCliente}.pdf`)
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
        const dataURL = canvas.toDataURL('image/png')
        resolve(dataURL)
      }
      img.onerror = reject
      img.src = path
    })
  }
  