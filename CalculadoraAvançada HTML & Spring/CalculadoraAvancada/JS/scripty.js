class Calculator {
    constructor() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.waitingForNewInput = false;
        this.display = document.getElementById('result');
        
        this.initializeEventListeners();
        this.updateDisplay();
    }

    initializeEventListeners() {

        document.querySelectorAll('.btn.number').forEach(button => {
            button.addEventListener('click', (e) => {
                this.inputNumber(e.target.textContent);
            });
        });

        document.querySelectorAll('.btn.operator').forEach(button => {
            button.addEventListener('click', (e) => {
                this.inputOperator(e.target.textContent);
            });
        });

        document.querySelector('.btn.clear').addEventListener('click', () => {
            this.clear();
        });

        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });

         document.getElementById('btn-equal').addEventListener('click', () => {
        this.calculate();
         });
        
    }

    inputNumber(num) {
        if (this.waitingForNewInput) {
            this.currentInput = num;
            this.waitingForNewInput = false;
        } else {
            this.currentInput = this.currentInput === '0' ? num : this.currentInput + num;
        }
        this.updateDisplay();
    }

    inputOperator(op) {
        if (this.operation !== null && !this.waitingForNewInput) {
            this.calculate();
        }

        this.operation = op;
        this.previousInput = this.currentInput;
        this.waitingForNewInput = true;
    }

    async calculate() {
        if (this.operation === null || this.waitingForNewInput) return;

        const num1 = parseFloat(this.previousInput);
        const num2 = parseFloat(this.currentInput);
        
        const operationMap = {
            '+': 'somar',
            '-': 'subtrair',
            'x': 'multiplicar',
            '÷': 'dividir'
        };

        const springBootOperation = operationMap[this.operation];
        
        if (!springBootOperation) {
            this.showError('Operação não suportada');
            return;
        }

        try {
            const resultado = await this.sendToBackend(num1, num2, springBootOperation);
            this.currentInput = resultado.toString();
            this.operation = null;
            this.previousInput = '';
            this.waitingForNewInput = true;
            this.updateDisplay();
        } catch (error) {
            this.showError(error.message);
        }
    }

    async sendToBackend(num1, num2, operacao) {

        const formData = new URLSearchParams();
        formData.append('num1', num1);
        formData.append('num2', num2);
        formData.append('operacao', operacao);

        const response = await fetch('http://localhost:8080/calcular', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Erro na comunicação com o servidor');
        }

        const data = await response.json();
        
        if (data['erro: ']) {
            throw new Error(data['erro: ']);
        }
        
        return data['resultado: '];
    }

    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.waitingForNewInput = false;
        this.updateDisplay();
    }

    updateDisplay() {
        this.display.value = this.currentInput;
    }

    showError(message) {
        this.currentInput = 'Erro';
        this.updateDisplay();
        setTimeout(() => {
            this.clear();
        }, 2000);
        console.error('Erro:', message);
    }

    handleKeyboardInput(e) {
        if (e.key >= '0' && e.key <= '9') {
            this.inputNumber(e.key);
        } else if (['+', '-', '*', '/'].includes(e.key)) {
            this.inputOperator(e.key);
        } else if (e.key === 'Enter' || e.key === '=') {
            this.calculate();
        } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
            this.clear();
        } else if (e.key === 'Backspace') {
            this.backspace();
        }
    }

    backspace() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});

