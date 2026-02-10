package com.devSenai2a.cadastro.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.devSenai2a.cadastro.entities.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
   // Método para buscar usuário pelo email
Usuario findByEmail(String email);
}