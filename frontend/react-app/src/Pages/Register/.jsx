    //==============================================================
        // ---- 1. Estados adicionales ----
    const [Torres, setTorres] = useState(1);
    const [PisosPorTorre, setPisosPorTorre] = useState(1);
    const [AptosPorPiso, setAptosPorPiso] = useState(1);

    // Amenidades
    const [SalonComunales, setSalonComunales] = useState(0);
    const [Gimnasio, setGimnasio] = useState(false);
    const [Parrillas, setParrillas] = useState(false);
    const [Piscina, setPiscina] = useState(false);
    // ...añade más amenities según necesites
    