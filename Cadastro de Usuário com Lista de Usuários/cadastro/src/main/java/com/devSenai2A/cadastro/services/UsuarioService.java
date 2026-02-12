package com.devSenai2A.cadastro.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.devSenai2A.cadastro.entities.Usuario;
import com.devSenai2A.cadastro.repositories.UsuarioRepository;

@Service
public class UsuarioService {
	
	@Autowired
	private UsuarioRepository repository;
	
	public List<Usuario> listarTodos(){
		return repository.findAll();
	}
	
	public Usuario cadastrar(Usuario usuario) {
		return repository.save(usuario);
	}

	public boolean deletar(Long id) {
	    if (!repository.existsById(id)) {
	        return false;
	    }
	    
	    repository.deleteById(id);
	    return true;
	}

	public Usuario atualizar(Long id, Usuario usuario) {
		// TODO Auto-generated method stub
		return null;
	}
}
