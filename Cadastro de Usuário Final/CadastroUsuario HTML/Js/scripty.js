// scrypt.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('calcForm');
    const API_URL = 'http://localhost:8080/usuarios';
    
    // Evento de submit do formulário
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Coleta os dados do formulário
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
        
        // Validação básica dos campos obrigatórios
        if (!usuario.nome || !usuario.email || !usuario.senha || !usuario.perfil) {
            alert('Por favor, preencha todos os campos obrigatórios: Nome, Email, Senha e Perfil!');
            return;
        }
        
        // Validação básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(usuario.email)) {
            alert('Por favor, insira um email válido!');
            return;
        }
        
        // Validação de senha (mínimo 6 caracteres)
        if (usuario.senha.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres!');
            return;
        }
        
        // Desabilita o botão para evitar múltiplos cliques
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Cadastrando...';
        submitButton.disabled = true;
        
        try {
            // Faz a requisição POST para a API
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario)
            });
            
            const responseData = await response.json();
            
            if (response.ok) {
                // Sucesso: limpa o formulário e mostra alerta
                form.reset();
                alert('✅ Usuário cadastrado com sucesso!\n\nNome: ' + usuario.nome + '\nEmail: ' + usuario.email);
                
                // Foca no primeiro campo para novo cadastro
                document.getElementById('nome').focus();
            } else {
                // Erro da API
                const errorMessage = responseData.message || responseData.error || `Erro ${response.status}`;
                throw new Error(errorMessage);
            }
            
        } catch (error) {
            // Tratamento de erros
            console.error('Erro ao cadastrar usuário:', error);
            
            let mensagemErro = '❌ Erro ao cadastrar usuário!';
            
            if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
                mensagemErro = '❌ Não foi possível conectar ao servidor. Verifique se a API está rodando em http://localhost:8080';
            } else if (error.message.includes('email') || error.message.includes('Email')) {
                mensagemErro = '❌ Erro com o email: Este email já pode estar cadastrado!';
            } else if (error.message.includes('400') || error.message.includes('Bad Request')) {
                mensagemErro = '❌ Dados inválidos enviados. Verifique os campos do formulário!';
            } else if (error.message.includes('409') || error.message.includes('Conflict')) {
                mensagemErro = '❌ Conflito: Este email já está cadastrado!';
            } else if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
                mensagemErro = '❌ Erro interno do servidor. Tente novamente mais tarde!';
            } else {
                mensagemErro = '❌ ' + error.message;
            }
            
            alert(mensagemErro);
        } finally {
            // Reabilita o botão
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
    
    // Validação em tempo real para CEP (formato 00000-000 ou 00000000)
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
    
    // Validação em tempo real para Estado (apenas 2 caracteres, maiúsculos)
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