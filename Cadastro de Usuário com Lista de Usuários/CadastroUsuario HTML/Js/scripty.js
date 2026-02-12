document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('calcForm');
    const API_URL = 'http://localhost:8080/usuarios';
    
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const usuario = {
            nome: document.getElementById('nome').value.trim(),
            email: document.getElementById('mail').value.trim(),
            senha: document.getElementById('senha').value.trim(),
            perfil: document.getElementById('perfil').value,
            endereco: document.getElementById('rua').value.trim(),
            bairro: document.getElementById('bairro').value.trim(),
            complemento: document.getElementById('complemento').value.trim(),
            cep: document.getElementById('cep').value.trim(),
            cidade: document.getElementById('cidade').value.trim(),
            estado: document.getElementById('estado').value.trim()
        };
        
        if (!usuario.nome || !usuario.email || !usuario.senha || !usuario.perfil) {
            alert('Por favor, preencha todos os campos obrigatórios: Nome, Email, Senha e Perfil!');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(usuario.email)) {
            alert('Por favor, insira um email válido!');
            return;
        }
        
        if (usuario.senha.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres!');
            return;
        }
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Cadastrando...';
        submitButton.disabled = true;
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario)
            });
            
            const responseData = await response.json();
            
            if (response.ok) {
                form.reset();
                alert(' Usuário cadastrado com sucesso!\n\nNome: ' + usuario.nome + '\nEmail: ' + usuario.email);
                
                document.getElementById('nome').focus();
            } else {
                const errorMessage = responseData.message || responseData.error || `Erro ${response.status}`;
                throw new Error(errorMessage);
            }
            
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            
            let mensagemErro = ' Erro ao cadastrar usuário!';
            
            if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
                mensagemErro = ' Não foi possível conectar ao servidor. Verifique se a API está rodando em http://localhost:8080';
            } else if (error.message.includes('email') || error.message.includes('Email')) {
                mensagemErro = ' Erro com o email: Este email já pode estar cadastrado!';
            } else if (error.message.includes('400') || error.message.includes('Bad Request')) {
                mensagemErro = ' Dados inválidos enviados. Verifique os campos do formulário!';
            } else if (error.message.includes('409') || error.message.includes('Conflict')) {
                mensagemErro = ' Conflito: Este email já está cadastrado!';
            } else if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
                mensagemErro = ' Erro interno do servidor. Tente novamente mais tarde!';
            } else {
                mensagemErro = ' ' + error.message;
            }
            
            alert(mensagemErro);
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
    
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            
            e.target.value = value;
        });
    }
    
    const estadoInput = document.getElementById('estado');
    if (estadoInput) {
        estadoInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
            
            if (value.length > 2) {
                value = value.substring(0, 2);
            }
            
            e.target.value = value;
        });
        
        estadoInput.addEventListener('blur', function(e) {
            if (e.target.value.length === 2) {
                e.target.value = e.target.value.toUpperCase();
            }
        });
    }
});