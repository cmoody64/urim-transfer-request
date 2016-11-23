import jsPDF from 'jspdf'
import CurrentFormStore from '../stores/currentFormStore.js'

export function currentFormToPDF() {
    debugger
    const doc = new jsPDF()
    const CENTER_X = doc.internal.pageSize.width / 2
    const CENTER_Y = doc.internal.pageSize.height / 2
    const COLUMN_SPAN_HALF = doc.internal.pageSize.width / 2
    const COLUMN_SPAN_THIRDS = doc.internal.pageSize.width / 3
    const COLUMN_SPAN_FOURTHS = doc.internal.pageSize.width / 4
    const COLUMN_SPAN_FIFTHS = doc.internal.pageSize.width / 5
    const COLUMN_PADDING = 10
    const LEFT_MARGIN = 20
    const TITLE_FONT_SIZE = 35
    const SUB_TITLE_FONT_SIZE = 20
    const ENTRY_BOX_HEIGHT = 8
    const ROW_ONE_LABEL_Y = 60
    const ROW_ONE_ENTRY_Y = 62
    const LABEL_FONT_SIZE = 12
    const ENTRY_FONT_SIZE = 12
    const ENTRY_X_PADDING = 3
    const ENTRY_Y_PADDING = 8

    // page title
    doc.setFontSize(TITLE_FONT_SIZE)
    doc.text('Record Transfer Form', CENTER_X, 30, 0, 0,'center')

    //Department Information
    doc.setFontSize(SUB_TITLE_FONT_SIZE)
    doc.text('Department Information', COLUMN_SPAN_FOURTHS, 50, 0, 0, 'center')

    //department number
    doc.setFontSize(LABEL_FONT_SIZE)
    doc.setFontStyle('bold')
    doc.text('Department Number', LEFT_MARGIN, ROW_ONE_LABEL_Y)

    doc.roundedRect(LEFT_MARGIN, ROW_ONE_ENTRY_Y, COLUMN_SPAN_FIFTHS, ENTRY_BOX_HEIGHT, 1, 1)
    doc.setFontStyle('normal')
    doc.setFontSize(ENTRY_FONT_SIZE)
    doc.text(`${CurrentFormStore.getFormData().batchData.departmentNumber}`, LEFT_MARGIN + ENTRY_X_PADDING, ROW_ONE_ENTRY_Y + ENTRY_Y_PADDING)

    window.globalDoc = doc
    let x = 5
    debugger
    debugger
}
