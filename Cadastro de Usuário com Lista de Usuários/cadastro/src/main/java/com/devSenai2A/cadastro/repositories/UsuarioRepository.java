package com.devSenai2A.cadastro.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.devSenai2A.cadastro.entities.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario,Long> {

}
