<script>
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // ELEMENTOS
    // ==========================================================

    const itemsContainer =
        document.getElementById('itemsContainer');

    const addItemBtn =
        document.getElementById('addItemBtn');

    const totalValueSpan =
        document.getElementById('totalValue');

    const generatePdfBtn =
        document.getElementById('generatePdfBtn');


    // ==========================================================
    // CALCULAR TOTAL
    // ==========================================================

    function calculateTotal() {

        let total = 0;

        const priceInputs =
            document.querySelectorAll('.item-price');

        priceInputs.forEach(input => {

            let value = input.value.trim();

            if (!value) return;

            value = value
                .replace(/R\$/gi, '')
                .replace(/\s/g, '');

            // Se tiver ponto e vírgula:
            // 1.250,50 -> 1250.50
            if (
                value.includes('.') &&
                value.includes(',')
            ) {
                value = value
                    .replace(/\./g, '')
                    .replace(',', '.');
            } else {
                value = value.replace(',', '.');
            }

            const number = parseFloat(value);

            if (!isNaN(number)) {
                total += number;
            }

        });

        totalValueSpan.textContent =
            total.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

        return total;
    }


    // ==========================================================
    // ATUALIZAR TOTAL
    // ==========================================================

    itemsContainer.addEventListener(
        'input',
        event => {

            if (
                event.target.classList.contains(
                    'item-price'
                )
            ) {
                calculateTotal();
            }

        }
    );


    // ==========================================================
    // ADICIONAR ITEM
    // ==========================================================

    addItemBtn.addEventListener(
        'click',
        () => {

            const row =
                document.createElement('div');

            row.className = 'item-row';

            row.innerHTML = `
                <input
                    type="text"
                    class="item-desc"
                    placeholder="Descrição do serviço"
                >

                <input
                    type="number"
                    class="item-price"
                    placeholder="Valor do Item"
                    step="0.01"
                    inputmode="decimal"
                >
            `;

            itemsContainer.appendChild(row);

            calculateTotal();
        }
    );


    // ==========================================================
    // GERAR PDF
    // ==========================================================

    generatePdfBtn.addEventListener(
        'click',
        async () => {

            const clientName =
                document
                    .getElementById('clientName')
                    .value
                    .trim();

            const clientPhone =
                document
                    .getElementById('clientPhone')
                    .value
                    .trim();


            // ==================================================
            // VERIFICAR CLIENTE
            // ==================================================

            if (!clientName) {

                alert(
                    'Por favor, informe o nome do cliente.'
                );

                return;
            }


            // ==================================================
            // VERIFICAR HTML2PDF
            // ==================================================

            if (
                typeof html2pdf === 'undefined'
            ) {

                alert(
                    'Erro: o motor do PDF não foi carregado.'
                );

                return;
            }


            // ==================================================
            // ELEMENTO ORIGINAL
            // ==================================================

            const original =
                document.getElementById(
                    'pdfTemplate'
                );

            if (!original) {

                alert(
                    'Erro: o modelo do PDF não foi encontrado.'
                );

                return;
            }


            // ==================================================
            // PREENCHER DADOS
            // ==================================================

            const pdfClientName =
                original.querySelector(
                    '#pdfClientName'
                );

            const pdfClientPhone =
                original.querySelector(
                    '#pdfClientPhone'
                );

            const pdfDate =
                original.querySelector(
                    '#pdfDate'
                );


            if (pdfClientName) {
                pdfClientName.textContent =
                    clientName;
            }

            if (pdfClientPhone) {
                pdfClientPhone.textContent =
                    clientPhone ||
                    'Não informado';
            }

            if (pdfDate) {
                pdfDate.textContent =
                    new Date()
                        .toLocaleDateString(
                            'pt-BR'
                        );
            }


            // ==================================================
            // MONTAR TABELA
            // ==================================================

            const pdfTableBody =
                original.querySelector(
                    '#pdfTableBody'
                );

            if (!pdfTableBody) {

                alert(
                    'Erro: tabela do PDF não encontrada.'
                );

                return;
            }

            pdfTableBody.innerHTML = '';


            const descInputs =
                document.querySelectorAll(
                    '.item-desc'
                );

            const priceInputs =
                document.querySelectorAll(
                    '.item-price'
                );


            let totalFinal = 0;


            descInputs.forEach(
                (descInput, index) => {

                    const desc =
                        descInput.value.trim() ||
                        'Item ' + (index + 1);


                    let priceText =
                        priceInputs[index]
                            .value
                            .trim();


                    priceText =
                        priceText
                            .replace(/R\$/gi, '')
                            .replace(/\s/g, '');


                    if (
                        priceText.includes('.') &&
                        priceText.includes(',')
                    ) {

                        priceText =
                            priceText
                                .replace(/\./g, '')
                                .replace(',', '.');

                    } else {

                        priceText =
                            priceText.replace(',', '.');

                    }


                    const price =
                        parseFloat(priceText) || 0;


                    totalFinal += price;


                    // ------------------------------------------
                    // LINHA
                    // ------------------------------------------

                    const tr =
                        document.createElement('tr');


                    // ------------------------------------------
                    // DESCRIÇÃO
                    // ------------------------------------------

                    const tdDesc =
                        document.createElement('td');

                    tdDesc.textContent =
                        desc;

                    tdDesc.style.border =
                        '1px solid #dddddd';

                    tdDesc.style.padding =
                        '8px';

                    tdDesc.style.textAlign =
                        'left';

                    tdDesc.style.wordBreak =
                        'break-word';

                    tdDesc.style.overflowWrap =
                        'break-word';


                    // ------------------------------------------
                    // VALOR
                    // ------------------------------------------

                    const tdPrice =
                        document.createElement('td');

                    tdPrice.textContent =
                        'R$ ' +
                        price.toLocaleString(
                            'pt-BR',
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        );

                    tdPrice.style.border =
                        '1px solid #dddddd';

                    tdPrice.style.padding =
                        '8px';

                    tdPrice.style.textAlign =
                        'right';

                    tdPrice.style.width =
                        '120px';

                    tdPrice.style.minWidth =
                        '120px';

                    tdPrice.style.maxWidth =
                        '120px';

                    tdPrice.style.whiteSpace =
                        'nowrap';


                    tr.appendChild(tdDesc);
                    tr.appendChild(tdPrice);

                    pdfTableBody.appendChild(tr);

                }
            );


            // ==================================================
            // TOTAL DO PDF
            // ==================================================

            const pdfTotalValue =
                original.querySelector(
                    '#pdfTotalValue'
                );

            if (pdfTotalValue) {

                pdfTotalValue.textContent =
                    totalFinal.toLocaleString(
                        'pt-BR',
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    );

            }


            // ==================================================
            // NOME DO ARQUIVO
            // ==================================================

            const safeName =
                clientName
                    .replace(
                        /[\\/:*?"<>|]/g,
                        ''
                    )
                    .replace(
                        /\s+/g,
                        '_'
                    );


            const safeFileName =
                'Orcamento_' +
                safeName +
                '.pdf';


            // ==================================================
            // CRIAR CÓPIA TEMPORÁRIA
            // ==================================================

            const pdfWrapper =
                document.createElement('div');

            pdfWrapper.style.position =
                'fixed';

            pdfWrapper.style.left =
                '0';

            pdfWrapper.style.top =
                '0';

            pdfWrapper.style.width =
                '200mm';

            pdfWrapper.style.margin =
                '0';

            pdfWrapper.style.padding =
                '0';

            pdfWrapper.style.background =
                '#ffffff';

            pdfWrapper.style.zIndex =
                '2147483647';

            pdfWrapper.style.display =
                'block';

            pdfWrapper.style.visibility =
                'visible';

            pdfWrapper.style.opacity =
                '1';

            pdfWrapper.style.pointerEvents =
                'none';


            // ==================================================
            // CLONAR PDF
            // ==================================================

            const pdfClone =
                original.cloneNode(true);


            pdfClone.removeAttribute('id');


            pdfClone.style.position =
                'relative';

            pdfClone.style.left =
                '0';

            pdfClone.style.top =
                '0';

            pdfClone.style.width =
                '200mm';

            pdfClone.style.maxWidth =
                '200mm';

            pdfClone.style.minHeight =
                '287mm';

            pdfClone.style.height =
                'auto';

            pdfClone.style.margin =
                '0';

            pdfClone.style.padding =
                '20mm';

            pdfClone.style.background =
                '#ffffff';

            pdfClone.style.visibility =
                'visible';

            pdfClone.style.display =
                'block';

            pdfClone.style.overflow =
                'visible';

            pdfClone.style.boxSizing =
                'border-box';


            // ==================================================
            // CORRIGIR TABELA DA CÓPIA
            // ==================================================

            const cloneTable =
                pdfClone.querySelector(
                    '.pdf-table'
                );


            if (cloneTable) {

                cloneTable.style.width =
                    '100%';

                cloneTable.style.maxWidth =
                    '100%';

                cloneTable.style.tableLayout =
                    'fixed';

                cloneTable.style.borderCollapse =
                    'collapse';


                const cloneCells =
                    cloneTable.querySelectorAll(
                        'th, td'
                    );


                cloneCells.forEach(
                    cell => {

                        cell.style.boxSizing =
                            'border-box';

                    }
                );


                const cloneLastCells =
                    cloneTable.querySelectorAll(
                        'th:last-child, td:last-child'
                    );


                cloneLastCells.forEach(
                    cell => {

                        cell.style.width =
                            '120px';

                        cell.style.minWidth =
                            '120px';

                        cell.style.maxWidth =
                            '120px';

                        cell.style.textAlign =
                            'right';

                        cell.style.whiteSpace =
                            'nowrap';

                    }
                );

            }


            // ==================================================
            // COLOCAR CÓPIA NA TELA
            // ==================================================

            pdfWrapper.appendChild(
                pdfClone
            );

            document.body.appendChild(
                pdfWrapper
            );


            // ==================================================
            // AGUARDAR RENDERIZAÇÃO
            // ==================================================

            await new Promise(
                resolve => {

                    requestAnimationFrame(
                        () => {

                            requestAnimationFrame(
                                () => {

                                    resolve();

                                }
                            );

                        }
                    );

                }
            );


            // ==================================================
            // CONFIGURAÇÃO DO PDF
            // ==================================================

            const options = {

                margin: [
                    5,
                    5,
                    5,
                    5
                ],

                filename:
                    safeFileName,


                image: {
                    type: 'jpeg',
                    quality: 0.98
                },


                html2canvas: {

                    scale: 2,

                    useCORS: true,

                    allowTaint: false,

                    backgroundColor:
                        '#ffffff',

                    scrollX: 0,

                    scrollY: 0,

                    x: 0,

                    y: 0,

                    logging: false

                },


                jsPDF: {

                    unit: 'mm',

                    format: 'a4',

                    orientation:
                        'portrait'

                },


                pagebreak: {

                    mode: [
                        'css',
                        'legacy'
                    ]

                }

            };


            // ==================================================
            // GERAR
            // ==================================================

            try {

                await html2pdf()
                    .set(options)
                    .from(pdfClone)
                    .save();


            } catch (error) {

                console.error(
                    'Erro ao gerar PDF:',
                    error
                );

                alert(
                    'Erro ao gerar o PDF:\n\n' +
                    error.message
                );


            } finally {

                // ==============================================
                // APAGAR CÓPIA TEMPORÁRIA
                // ==============================================

                if (
                    pdfWrapper &&
                    pdfWrapper.parentNode
                ) {

                    pdfWrapper.parentNode
                        .removeChild(
                            pdfWrapper
                        );

                }

            }

        }
    );


    // ==========================================================
    // TOTAL INICIAL
    // ==========================================================

    calculateTotal();

});
</script></input>