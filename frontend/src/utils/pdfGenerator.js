import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function generateInvoicePdf(element) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  })

  const imgData = canvas.toDataURL('image/png')
  const doc = new jsPDF({ unit: 'mm', format: 'a5', orientation: 'portrait' })

  const imgW = 148
  const imgH = (canvas.height * imgW) / canvas.width

  if (imgH <= 210) {
    doc.addImage(imgData, 'PNG', 0, 0, imgW, imgH)
  } else {
    let posY = 0
    while (posY < imgH) {
      if (posY > 0) doc.addPage()
      doc.addImage(imgData, 'PNG', 0, -posY, imgW, imgH)
      posY += 210
    }
  }

  return doc.output('datauristring')
}
