const pdf = require('html-pdf');
const path = require('path');

const createBudgetPDF = () => {
    const content = `
<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body {
        width: 100%;
        color: #5D6975;
        font-family: Arial;
        padding: 0.5cm;
        font-size: 0.25cm;
    }
    h1 {
        font-size: 0.5cm;
        padding: 0.15cm 0;
        text-align: center;
        border-top: 1px solid #5D6975;
        border-bottom: 1px solid #5D6975;
    }
    header {
        padding: 0.15cm 0;
    }

    header p {
        margin-bottom: 0.1cm;
    }
    .customer {
        float: left;
    }
    .customer p span:nth-child(1) {
        display: inline-block;
        width: 2cm;
        text-align: right;
        font-size: 0.24cm;
        margin-right: 0.2cm;
    }
    .customer p span:nth-child(2) {
        font-size: 0.30cm;
        color: #3e4246;
    }
    .company {
        float: right;
    }
</style>
<body>
    <h1>Presupuesto</h1>
    <header>
        <div class="customer">
            <p><span>CLIENTE</span><span>Gas Natural</span></p>
            <p><span>DIRECCIÓN</span><span>Gran Vía, 40</span></p>
            <p><span>LOCALIDAD</span><span>Bilbao</span></p>
            <p><span>A/ATT.</span><span>Juan Pérez</span></p>
            <p><span>EMAIL</span><span>juan@gas.com</span></p>
            <p><span>FECHA</span><span>30/6/2021</span></p>
            <p><span>VÁLIDO HASTA</span><span>30/7/2021</span></p>
        </div>
        <div class="company">
            <p>ACME, S.A.</p>
            <p>Serrano Galvache, 26 28033 Madrid</p>
            <p>+34919999999</p>
            <p>info@acme.com</p>
        </div>
    </header>
</body>
    `;

    pdf.create(content).toFile(path.join(__dirname, '../budgetsPDF/' + 'test.pdf'), (err, res) => {
        if(err) {
            console.log(err);
        }
    })
}

module.exports = {
    createBudgetPDF
}