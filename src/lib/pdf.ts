import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { ComputeResult } from './amortization'

export function exportPDF(res: ComputeResult) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })

  const margin = 36
  const pageWidth = doc.internal.pageSize.getWidth()

  doc.setFontSize(16)
  doc.text('Loan Amortization Schedule', margin, 48)

  doc.setFontSize(10)
  doc.text(`Monthly payment: $${res.monthlyPayment.toFixed(2)}`, margin, 64)
  doc.text(`Total interest: $${res.totalInterest.toFixed(2)}`, margin, 78)

  autoTable(doc, {
    startY: 96,
    head: [[ '#', 'Date', 'Payment', 'Interest', 'Principal', 'Balance' ]],
    body: res.schedule.map(r => [r.month, r.date, d(r.payment), d(r.interest), d(r.principal), d(r.balance)]),
    styles: { fontSize: 8, halign: 'right' },
    headStyles: { fillColor: [14,165,233], halign: 'right' },
    columnStyles: {
      0: { halign: 'left' },
      1: { halign: 'left' },
    },
    margin: { left: margin, right: margin },
    didDrawPage: (data) => {
      const page = doc.getCurrentPageInfo().pageNumber
      doc.setFontSize(9)
      doc.text(`Page ${page}`, pageWidth - margin, doc.internal.pageSize.getHeight() - margin/2, { align: 'right' })
    }
  })

  doc.save('loan-amortization.pdf')
}

function d(n: number) { return n.toFixed(2) }
