package com.example.PlataformaEventos.auth.services;

import com.example.PlataformaEventos.auth.dtos.LoginRequestDto;
import com.example.PlataformaEventos.auth.dtos.LoginResponseDto;
import com.example.PlataformaEventos.auth.securities.JwtService;
import com.example.PlataformaEventos.exception.ConflictException;
import com.example.PlataformaEventos.user.dtos.UserRequestDto;
import com.example.PlataformaEventos.user.dtos.UserResponseDto;
import com.example.PlataformaEventos.user.entities.User;
import com.example.PlataformaEventos.user.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public UserResponseDto register(UserRequestDto dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new ConflictException("Email já cadastrado");
        }

        User user = User.builder()
                .name(dto.name())
                .email(dto.email())
                .password(passwordEncoder.encode(dto.password()))
                .build();

        User userSaved = userRepository.save(user);
        return new UserResponseDto(userSaved);
    }

    public LoginResponseDto login(LoginRequestDto dto) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                dto.email(),
                                dto.password()
                        )
                );

        User user = (User) authentication.getPrincipal();

        String token = jwtService.generateToken(user);

        return new LoginResponseDto(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
