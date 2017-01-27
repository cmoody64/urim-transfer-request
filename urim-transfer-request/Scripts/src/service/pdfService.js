import createPdf from 'pdfmake-browserified'
import { DISPOSITION_FIELD_DEFAULT_VALUE } from '../stores/storeConstants.js'

// returns an ArrayBuffer of the current form pdf
export async function currentFormToPDF(formData) {
    const docList = createDocList(formData)
    const bufferList = []
    for(let i = 0; i < docList.length; i++) {
        bufferList[i] = await getArrayBufferFromPDF(docList[i])
    }

    return bufferList;
}

function createDocList(form) {
    return form.boxes.map((box) => {

        // for each box, create a custom document definition and map the box to a pdf document object
        const docDefinition = {
            content: [
                        { text: 'Record Transfer Sheet', bold: true, alignment: 'center', margin: [0, 10, 0, 30], fontSize: 25 },
                        { text: 'Deparment Information', style: 'subheader' },
                        {
                            style: 'tableExample',
                            table: {
                                    widths: [120, 251, 120],
                                    body: [
                                            // row 1
                                            [
                                                {
                                                    stack: [
                                                        {text: 'Department Number', style: 'tableHeader'},
                                                        {text: `${form.batchData.departmentNumber}`, style: 'tableEntry' }
                                                    ]
                                                },
                                                {
                                                    stack: [
                                                        {text: 'Department Name', style: 'tableHeader'},
                                                        {text: `${form.batchData.departmentName}`, style: 'tableEntry' }
                                                    ]
                                                },
                                                {
                                                    stack: [
                                                        {text: 'Dep. Phone #', style: 'tableHeader'},
                                                        {text: `${form.batchData.departmentPhone}`, style: 'tableEntry' }
                                                    ]
                                                },
                                            ],
                                    ]
                            }
                        },
                        {
                            table: {
                                widths: [250, 250],
                                body: [
                                        // row 1
                                        [
                                            {
                                                stack: [
                                                    {text: 'Person Preparing Records for Storage', style: 'tableHeader'},
                                                    {text: `${form.batchData.prepPersonName}`, style: 'tableEntry' }
                                                ]
                                            },
                                            {
                                                stack: [
                                                    {text: 'Person Responsable for Records', style: 'tableHeader'},
                                                    {text: `${form.batchData.responsablePersonName}`, style: 'tableEntry' }
                                                ]
                                            },
                                        ],
                                ]
                            }
                        },
                        {
                            table: {
                                widths: [164, 163, 164],
                                body: [
                                        // row 1
                                        [
                                            {
                                                stack: [
                                                    {text: 'Department Address', style: 'tableHeader'},
                                                    {text: `${form.batchData.departmentAddress}`, style: 'tableEntry' }
                                                ]
                                            },
                                            {
                                                stack: [
                                                    {text: 'College / Division', style: 'tableHeader'},
                                                    {text: `${form.batchData.departmentCollege}`, style: 'tableEntry' }
                                                ]
                                            },
                                            {
                                                stack: [
                                                    {text: 'Date of Preparation', style: 'tableHeader'},
                                                    {text: `${form.batchData.dateOfPreparation}`, style: 'tableEntry' }
                                                ]
                                            },
                                        ],
                                ]
                            }
                        },
                        {
                            table: {
                                widths: [508],
                                body: [
                                        // row 1
                                        [
                                            {
                                                stack: [
                                                    {text: 'Special Pickup Instructions', style: 'tableHeader'},
                                                    {text: `${form.batchData.pickupInstructions || ' '}`, style: 'tableEntry' }
                                                ]
                                            },
                                        ],
                                ]
                            }
                        },

                        // box info tables
                        { text: 'Box Information', style: 'subheader', margin: [0, 35, 0, 5] },
                        {
                            style: 'tableExample',
                            table: {
                                    widths: [164, 163, 164],
                                    body: [
                                            // row 1
                                            [
                                                {
                                                    stack: [
                                                        {text: 'Box Number', style: 'tableHeader'},
                                                        {text: `${box.boxNumber}`, style: 'tableEntry' }
                                                    ]
                                                },
                                                {
                                                    stack: [
                                                        {text: 'Beginning Date of Records', style: 'tableHeader'},
                                                        {text: `${box.beginningRecordsDate}`, style: 'tableEntry' }
                                                    ]
                                                },
                                                {
                                                    stack: [
                                                        {text: 'Ending Date of Records', style: 'tableHeader'},
                                                        {text: `${box.endRecordsDate}`, style: 'tableEntry' }
                                                    ]
                                                },
                                            ],
                                    ]
                            }
                        },
                        {
                            table: {
                                    widths: [164, 163, 164],
                                    body: [
                                            // row 1
                                            [
                                                {
                                                    stack: [
                                                        {text: 'Retention Category', style: 'tableHeader'},
                                                        {text: `${box.recordType || ''}`, style: 'tableEntry' }
                                                    ]
                                                },
                                                {
                                                    stack: [
                                                        {text: 'Retention (years)', style: 'tableHeader'},
                                                        {text: `${box.retention || ''}`, style: 'tableEntry' }
                                                    ]
                                                },
                                                {
                                                    stack: [
                                                        {text: 'Review Date', style: 'tableHeader'},
                                                        {text: `${box.reviewDate || ''}`, style: 'tableEntry' }
                                                    ]
                                                },
                                            ],
                                    ]
                            }
                        },
                        {
                            style: 'tableExample',
                            table: {
                                    widths: [164, 163, 164],
                                    body: [
                                            // row 1
                                            [
                                                {
                                                    stack: [
                                                        {text: 'Permanent', style: 'tableHeader'},
                                                        {text: `${box.disposition || DISPOSITION_FIELD_DEFAULT_VALUE}`, style: 'tableEntry' }
                                                    ]
                                                },
                                                {
                                                    stack: [
                                                        {text: 'Permanent Review Period', style: 'tableHeader'},
                                                        {text: `${box.permanentReviewPeriod || ''}`, style: 'tableEntry' }
                                                    ]
                                                },
                                                {
                                                    stack: [
                                                        {text: 'Object #', style: 'tableHeader'},
                                                        {text: `${box.objectNumber}`, style: 'tableEntry' }
                                                    ]
                                                }
                                            ],
                                    ]
                            }
                        },
                        {
                            table: {
                                widths: [164, 163],
                                body: [
                                        // row 1
                                        [
                                            {
                                                stack: [
                                                    {text: 'Approver', style: 'tableHeader'},
                                                    {text: `${box.approver}`, style: 'tableEntry' }
                                                ]
                                            },
                                            {
                                                stack: [
                                                    {text: 'Approval Date', style: 'tableHeader'},
                                                    {text: `${box.approvalDate}`, style: 'tableEntry' }
                                                ]
                                            },
                                        ],
                                ]
                            }
                        },

                        // box description
                        { text: 'Box Description', bold: true, margin: [40, 15, 0, 5], fontSize: 14 },
                        { text: `${box.description}`, color: 'gray', bold: true}
            ],
            styles: {
                subheader: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 10, 0, 7]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                },
                tableEntry: {
                    color: 'gray',
                    bold: true,
                    margin: [0, 4, 0, 0]
                }
            },
        }


        // each box maps to a document object
        return createPdf(docDefinition)
    })
}

function getArrayBufferFromPDF(docObject) {
    let bufferPromise = $.Deferred()

    docObject.getBuffer((bufferView) => {
        let buffer = bufferView.toArrayBuffer()
        buffer.byteLength ? bufferPromise.resolve(buffer) : bufferPromise.reject('error retrieving array buffer')
    })

    return bufferPromise.promise();
}
