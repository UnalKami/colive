@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        if (!usuario.isVerificado() || usuario.getContraseña() == null) {
            throw new DisabledException("Cuenta no verificada o sin contraseña.");
        }

        return User.builder()
            .username(usuario.getCorreo())
            .password(usuario.getContraseña())
            .roles(usuario.getRol())
            .build();
    }
}
