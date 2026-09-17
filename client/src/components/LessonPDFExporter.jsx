import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import LessonRenderer from './LessonRenderer'

/**
 * Milestone 11: renders an off-screen, light-themed copy of the lesson (so PDF output stays
 * consistent regardless of the active UI theme), captures it with html2canvas, and streams it
 * into a downloadable jsPDF document.
 */
export default function LessonPDFExporter({ lesson }) {
  const printRef = useRef(null)
  const [isExporting, setIsExporting] = useState(false)

  async function handleExport() {
    if (!printRef.current) return
    setIsExporting(true)
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      })
      const imgData = canvas.toDataURL('image/png')

      const pdf = new jsPDF('p', 'pt', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const filename = `${lesson.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.pdf`
      pdf.save(filename)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="rounded-md border border-ink-700/20 hover:bg-ink-900/5 px-4 py-2 text-sm font-medium transition-colors focus-ring disabled:opacity-50"
      >
        {isExporting ? 'Preparing PDF…' : 'Download as PDF'}
      </button>

      {/* Hidden, PDF-styled render used only as the html2canvas capture target */}
      <div className="fixed -left-[9999px] top-0 w-[700px]" aria-hidden="true">
        <div ref={printRef} className="bg-white text-black p-10 font-sans">
          <h1 className="font-serif text-3xl mb-2">{lesson.title}</h1>
          {lesson.objectives?.length > 0 && (
            <div className="mb-6">
              <p className="font-semibold mb-1">Objectives</p>
              <ul className="list-disc pl-5 text-sm">
                {lesson.objectives.map((o, i) => <li key={i}>{o}</li>)}
              </ul>
            </div>
          )}
          <LessonRenderer content={(lesson.content || []).filter((b) => b.type !== 'video')} />
        </div>
      </div>
    </>
  )
}
