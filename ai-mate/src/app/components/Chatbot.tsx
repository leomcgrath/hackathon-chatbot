"use client";

import { GoogleGenerativeAI } from '@google/generative-ai';
import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';

// Define the shape of a chat message
type Message = {
  sender: 'user' | 'bot';
  text: string;
};

var allPromts = "";

const Chatbot: React.FC = () => {
  // Start with the initial bot message "Hvordan kan jeg hjelpe deg?"
  const [conversation, setConversation] = useState<Message[]>([
    { sender: 'bot', text: "Hei! Jeg heter Emrik, og er en e-handelsassistent. Hvordan kan jeg hjelpe deg?" }
  ]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Create a ref to scroll to the bottom when new messages are added
  const conversationEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom whenever the conversation changes
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSendMessage = async (): Promise<void> => {
    if (!userInput.trim()) return;

    // Append the user's message to the conversation
    const userMessage: Message = { sender: 'user', text: userInput };
    setConversation((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // WARNING: For production, move the API key to a secure backend or use environment variables.
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      allPromts += userInput + "\n";
      console.log("dette er alle promtsene: " + allPromts);

      const modifiedPrompt = `
      Du er en e-handelassistent i en elektronikkbutikk. Under er all informasjon om produktene i butikken din. Hver rad representerer et produkt med navn, kategori, URL til produktinformasjon, URL til bilde, pris, ID og beskrivelse. 

      Tidligere meldinger med kunden: ${allPromts}

      Produkt;Kategori;URL til produktinformasjon;URL til bilde (.jpg);Pris (NOK);ID;Beskrivelse
      SmartGlow LED-lamper;Belysning;https://example.com/smartglow-led-lamper;https://example.com/images/smartglow-led-lamper.jpg;299;SG001;Lys opp hjemmet ditt med SmartGlow LED-lamper, som tilbyr justerbar lysstyrke og fargetemperatur via en brukervennlig app. Perfekt for å skape den rette stemningen.
      SoundWave Bluetooth-høyttalere;Lyd;https://example.com/soundwave-hoyttalere;https://example.com/images/soundwave-hoyttalere.jpg;699;SW002;Nyt krystallklar lyd med SoundWave Bluetooth-høyttalere. Disse bærbare høyttalerne gir kraftig lydkvalitet, lang batterilevetid, og er vannavstøtende.
      PowerMax bærbare ladere;Lading;https://example.com/powermax-ladere;https://example.com/images/powermax-ladere.jpg;399;PM003;Hold enhetene dine oppladet uansett hvor du er med PowerMax bærbare ladere. Med høy kapasitet og hurtigladingsteknologi, sikrer PowerMax at du aldri går tom for strøm.
      UltraClear 4K-skjermer;Skjermer;https://example.com/ultraclear-4k-skjermer;https://example.com/images/ultraclear-4k-skjermer.jpg;3499;UC004;Opplev uslåelig bildekvalitet med UltraClear 4K-skjermer. Ideell for både arbeid og underholdning, tilbyr disse skjermene sylskarpe bilder og imponerende fargegjengivelse.
      FastCharge trådløse ladestasjoner;Lading;https://example.com/fastcharge-ladestasjoner;https://example.com/images/fastcharge-ladestasjoner.jpg;499;FC005;Si farvel til kabler med FastCharge trådløse ladestasjoner. Plasser telefonen på laderen for en rask og effektiv oppladning uten knotete ledninger.
      ProTech gaming-tastaturer;Gaming;https://example.com/protech-gaming-tastaturer;https://example.com/images/protech-gaming-tastaturer.jpg;1199;PT006;Dominer i spillene dine med ProTech gaming-tastaturer. Med mekaniske taster, RGB-belysning, og programmerbare makrotaster, får du en responsiv og skreddersydd spillopplevelse.
      AeroPods trådløse ørepropper;Lyd;https://example.com/aeropods-orepropper;https://example.com/images/aeropods-orepropper.jpg;799;AP007;AeroPods gir deg friheten til å bevege deg uten kabler, samtidig som de leverer førsteklasses lydkvalitet. Med støydemping og lang batterilevetid er de perfekte for daglig bruk.
      SpeedConnect WiFi-forsterkere;Nettverk;https://example.com/speedconnect-wifi;https://example.com/images/speedconnect-wifi.jpg;599;SC008;Forsterk signalet i hjemmet ditt med SpeedConnect WiFi-forsterkere. De sikrer rask og pålitelig internettdekning i alle rom, uansett størrelse på boligen.
      SmartHome sikkerhetskameraer;Sikkerhet;https://example.com/smarthome-kameraer;https://example.com/images/smarthome-kameraer.jpg;1499;SH009;Hold hjemmet ditt trygt med SmartHome sikkerhetskameraer. Disse kameraene gir deg sanntids overvåking via app, nattsyn, og toveis lydkommunikasjon for ekstra trygghet.
      TechGuard skjermbeskyttere;Tilbehør;https://example.com/techguard-skjermbeskyttere;https://example.com/images/techguard-skjermbeskyttere.jpg;199;TG010;Beskytt skjermen din mot riper og skader med TechGuard skjermbeskyttere. Laget av slitesterkt, herdet glass som er enkel å påføre uten bobler.
      RoboClean robotstøvsugere;Husholdning;https://example.com/roboclean-stovsugere;https://example.com/images/roboclean-stovsugere.jpg;2999;RC011;Gjør rengjøringen til en lek med RoboClean robotstøvsugere. De navigerer effektivt gjennom hjemmet ditt, fjerner støv og smuss, og kan programmeres til å rengjøre når du ikke er hjemme.
      PixelView VR-briller;VR;https://example.com/pixelview-vr-briller;https://example.com/images/pixelview-vr-briller.jpg;2499;PV012;Gå inn i en ny verden med PixelView VR-briller. Opplev immersive 360-graders videoer og spill med en bred synsvinkel og høy komfort for lange økter.
      EcoCharge solcelleladere;Bærekraft;https://example.com/ecocharge-solcelleladere;https://example.com/images/ecocharge-solcelleladere.jpg;599;EC013;Lad enhetene dine bærekraftig med EcoCharge solcelleladere. Ideell for camping eller utendørsaktiviteter, disse laderne er lette, bærbare, og miljøvennlige.
      CloudSync bærbare harddisker;Lagring;https://example.com/cloudsync-harddisker;https://example.com/images/cloudsync-harddisker.jpg;899;CS014;Sikkerhetskopier dine viktige filer med CloudSync bærbare harddisker. Med høy lagringskapasitet og rask overføringshastighet, er dette det perfekte valget for alle dine lagringsbehov.
      HyperSpeed gaming-mus;Gaming;https://example.com/hyperspeed-gaming-mus;https://example.com/images/hyperspeed-gaming-mus.jpg;699;HS015;Øk presisjonen i spillene dine med HyperSpeed gaming-mus. Denne musen har justerbar DPI, ergonomisk design, og RGB-belysning for en skreddersydd spillopplevelse.
      SafeVault digitale låser;Sikkerhet;https://example.com/safevault-digitale-laser;https://example.com/images/safevault-digitale-laser.jpg;1299;SV016;Beskytt dine verdier med SafeVault digitale låser. Med fingeravtrykksgjenkjenning og appstyrt låsing gir disse låsene deg full kontroll og sikkerhet.
      NanoGuard antivirus-programvare;Programvare;https://example.com/nanoguard-antivirus;https://example.com/images/nanoguard-antivirus.jpg;399;NG017;Hold dataene dine trygge med NanoGuard antivirus-programvare. Den beskytter mot de nyeste truslene og gir sanntidsbeskyttelse uten å senke ytelsen på enheten din.
      OptiZoom digitale kameraer;Fotografi;https://example.com/optizoom-kameraer;https://example.com/images/optizoom-kameraer.jpg;1999;OZ018;Ta skarpe og levende bilder med OptiZoom digitale kameraer. Med høy optisk zoom og avanserte fotograferingsfunksjoner er disse kameraene perfekte for både amatører og profesjonelle.
      AirBreeze smartvifter;Husholdning;https://example.com/airbreeze-smartvifter;https://example.com/images/airbreeze-smartvifter.jpg;999;AB019;Hold deg kjølig med AirBreeze smartvifter. De tilbyr fjernstyrt hastighetsjustering og tidsinnstillinger via app, slik at du alltid har det komfortabelt hjemme.
      MaxPower stasjonære PC-er;Datamaskiner;https://example.com/maxpower-stasjonare-pcer;https://example.com/images/maxpower-stasjonare-pcer.jpg;8999;MP020;Få kraften du trenger for arbeid eller spill med MaxPower stasjonære PC-er. Disse maskinene er utstyrt med de nyeste prosessorene og grafikkortene for høy ytelse.
      CrystalSound lydplanke;Lyd;https://example.com/crystalsound-lydplanke;https://example.com/images/crystalsound-lydplanke.jpg;1499;CS031;Få en kinolignende opplevelse hjemme med CrystalSound lydplanke. Leverer dyp bass og klar lydkvalitet for filmer, musikk og spill.
      SolarWave solcellelys;Belysning;https://example.com/solarwave-solcellelys;https://example.com/images/solarwave-solcellelys.jpg;499;SW032;SolarWave solcellelys er ideell for hagen eller terrassen. Lades opp av sollys om dagen og lyser automatisk opp når det blir mørkt.
      TurboClean høytrykkspyler;Husholdning;https://example.com/turboclean-hoytrykkspyler;https://example.com/images/turboclean-hoytrykkspyler.jpg;2499;TC033;Rengjør effektivt med TurboClean høytrykkspyler. Perfekt for rengjøring av terrasser, biler, og fasader.
      FlexiMount veggfeste for TV;Tilbehør;https://example.com/fleximount-veggfeste;https://example.com/images/fleximount-veggfeste.jpg;799;FM034;Få full fleksibilitet med FlexiMount veggfeste for TV. Justerbar vinkel og enkel installasjon for alle typer flatskjerm-TV-er.
      QuickHeat bærbar varmevifte;Husholdning;https://example.com/quickheat-varmevifte;https://example.com/images/quickheat-varmevifte.jpg;399;QH035;Hold deg varm på kalde dager med QuickHeat bærbar varmevifte. Kompakt design, rask oppvarming, og energieffektiv.
      AquaStream vannfilterkanne;Helse;https://example.com/aquastream-vannfilterkanne;https://example.com/images/aquastream-vannfilterkanne.jpg;299;AS036;Nyt rent og klart vann med AquaStream vannfilterkanne. Fjerner urenheter og forbedrer vannsmaken på en enkel og effektiv måte.
      PowerHub smartstrømuttak;Tilbehør;https://example.com/powerhub-smartstromuttak;https://example.com/images/powerhub-smartstromuttak.jpg;499;PH037;Kontrollér hjemmets strømforbruk med PowerHub smartstrømuttak. Styr enhetene dine via app og reduser energiforbruket.
      UltraTrack GPS-tracker;Sikkerhet;https://example.com/ultratrack-gps;https://example.com/images/ultratrack-gps.jpg;999;UT038;Hold styr på verdifulle eiendeler med UltraTrack GPS-tracker. Fungerer over hele verden med sanntids posisjonering via mobilapp.
      AeroFit treningsklokke;Helse;https://example.com/aerofit-treningsklokke;https://example.com/images/aerofit-treningsklokke.jpg;1199;AF039;Hold deg i form med AeroFit treningsklokke. Spor treningsøktene dine, overvåk hjertefrekvensen og motta personlige treningsinnsikter.
      SafeGuard røykvarsler;Sikkerhet;https://example.com/safeguard-roykvarsler;https://example.com/images/safeguard-roykvarsler.jpg;299;SG040;Beskytt hjemmet ditt med SafeGuard røykvarsler. Gir deg tidlig advarsel ved brannfare, og kan kobles til andre varsler i huset.
      ZoomPro videokonferansekamera;Kontor;https://example.com/zoompro-kamera;https://example.com/images/zoompro-kamera.jpg;1299;ZP041;Hold profesjonelle videokonferanser med ZoomPro kamera. Høy oppløsning, bredt synsfelt og automatisk fokus sikrer skarpe og klare bilder.
      ChillMate bærbar kjølebag;Utendørs;https://example.com/chillmate-kjolebag;https://example.com/images/chillmate-kjolebag.jpg;799;CM042;Hold mat og drikke kald på farten med ChillMate bærbar kjølebag. Ideell for piknik, camping eller dagsturer.
      PureAir luftrenser;Helse;https://example.com/pureair-luftrenser;https://example.com/images/pureair-luftrenser.jpg;1799;PA043;Pust lettere med PureAir luftrenser. Fjerner pollen, støv og andre partikler fra luften, og gir et sunnere inneklima.
      SmartMirror speil med lys;Husholdning;https://example.com/smartmirror-speil;https://example.com/images/smartmirror-speil.jpg;1499;SM044;Få perfekt lyssetting med SmartMirror speil. Justerbart lys, innebygd sensor, og Bluetooth-tilkobling for en smart morgenrutine.
      ActiveLight frontlykt for sykkel;Utendørs;https://example.com/activelight-lykt;https://example.com/images/activelight-lykt.jpg;499;AL045;Øk sikkerheten på sykkelturene dine med ActiveLight frontlykt. Kraftig lys og lang batterilevetid for maksimal synlighet i mørket.
      QuickSteam klesdamper;Husholdning;https://example.com/quicksteam-klesdamper;https://example.com/images/quicksteam-klesdamper.jpg;999;QS046;Fjern rynker fra klær raskt med QuickSteam klesdamper. Perfekt for sensitive stoffer som ikke tåler strykejern.
      SmartLock dørlås;Sikkerhet;https://example.com/smartlock-dorlås;https://example.com/images/smartlock-dorlås.jpg;1499;SL047;Sikre hjemmet ditt med SmartLock dørlås. Appstyrt, fingeravtrykksgjenkjenning, og tidsplanlegging gir deg full kontroll.
      FrostGuard bildeksel;Biltilbehør;https://example.com/frostguard-bildeksel;https://example.com/images/frostguard-bildeksel.jpg;799;FG048;Beskytt bilen din mot snø og is med FrostGuard bildeksel. Rask å montere og fjerne, og gir full dekning av frontruten.
      EcoWave oppvaskmaskin;Husholdning;https://example.com/ecowave-oppvaskmaskin;https://example.com/images/ecowave-oppvaskmaskin.jpg;6999;EW049;Spar vann og energi med EcoWave oppvaskmaskin. Stille drift, flere vaskeprogrammer, og tilkoblet app for fjernstyring.
      PowerGrip trådløse verktøy;Verktøy;https://example.com/powergrip-verktøy;https://example.com/images/powergrip-verktøy.jpg;1999;PG050;Fullfør alle dine DIY-prosjekter med PowerGrip trådløse verktøy. Sterk motor og lang batterilevetid gjør jobben enkel og effektiv.
      QuickFix sysett;Husholdning;https://example.com/quickfix-sysett;https://example.com/images/quickfix-sysett.jpg;199;QF051;Reparér klærne dine raskt med QuickFix sysett. Kompakt, bærbart, og inneholder alle nødvendige verktøy for små reparasjoner.
      ProFit massasjepistol;Helse;https://example.com/profit-massasjepistol;https://example.com/images/profit-massasjepistol.jpg;1499;PF052;Lindr ømme muskler med ProFit massasjepistol. Flere intensitetsnivåer og utskiftbare hoder for målrettet behandling.
      SmartPan induksjonskoketopp;Kjøkkenutstyr;https://example.com/smartpan-koketopp;https://example.com/images/smartpan-koketopp.jpg;5499;SP053;Tilbered mat raskt og sikkert med SmartPan induksjonskoketopp. Presis temperaturkontroll og smarte sikkerhetsfunksjoner.
      AquaFlow hageslange;Hage;https://example.com/aquaflow-hageslange;https://example.com/images/aquaflow-hageslange.jpg;399;AF054;Vann hagen din enkelt med AquaFlow hageslange. Slitesterk, fleksibel og utstyrt med justerbar munnstykke for ulike vanningsbehov.
      QuickDry hårføner;Skjønnhet;https://example.com/quickdry-harføner;https://example.com/images/quickdry-harføner.jpg;799;QD055;Få perfekt hår på kort tid med QuickDry hårføner. Kraftig motor og ionisk teknologi for rask og skånsom tørking.
      SkyLounge oppblåsbart loungemøbel;Utendørs;https://example.com/skylounge-loungemøbel;https://example.com/images/skylounge-loungemøbel.jpg;999;SL056;Slapp av hvor som helst med SkyLounge oppblåsbart loungemøbel. Enkel å blåse opp og tømme for luft, ideell for strand eller park.
      BrightView nattlys;Belysning;https://example.com/brightview-nattlys;https://example.com/images/brightview-nattlys.jpg;299;BV057;Gi hjemmet ditt et mykt, beroligende lys med BrightView nattlys. Sensorstyrt og energieffektivt, perfekt for barnerom.
      ActiveTrack aktivitetsklokke;Helse;https://example.com/activetrack-klokke;https://example.com/images/activetrack-klokke.jpg;999;AT058;Hold deg aktiv med ActiveTrack aktivitetsklokke. Spor trening, søvn, og puls, og motta helsedata direkte på håndleddet.
      SafeTrip dashbordkamera;Biltilbehør;https://example.com/safetrip-dashcam;https://example.com/images/safetrip-dashcam.jpg;1499;ST059;Dokumentér kjøreturene dine med SafeTrip dashbordkamera. Høyoppløselig video, nattsyn, og bevegelsessensorer for ekstra sikkerhet.
      AquaPure vannrenser;Helse;https://example.com/aquapure-vannrenser;https://example.com/images/aquapure-vannrenser.jpg;1999;AP060;Få rent drikkevann hjemme med AquaPure vannrenser. Fjerner bakterier, klor og andre forurensninger, og gir deg trygt og friskt vann.
      GripFit treningsbånd;Fitness;https://example.com/gripfit-treningsbånd;https://example.com/images/gripfit-treningsbånd.jpg;399;GF061;Tren hele kroppen med GripFit treningsbånd. Flere motstandsnivåer for varierte og effektive treningsøkter hjemme eller på farten.
      SoundShield øreklokker;Lyd;https://example.com/soundshield-øreklokker;https://example.com/images/soundshield-øreklokker.jpg;599;SS062;Beskytt hørselen din med SoundShield øreklokker. Perfekte for byggarbeid, skyting, eller andre høylytte omgivelser.
      TurboVent kjøkkenvifte;Kjøkkenutstyr;https://example.com/turbovent-kjøkkenvifte;https://example.com/images/turbovent-kjøkkenvifte.jpg;3999;TV063;Hold kjøkkenet ditt fritt for røyk og lukt med TurboVent kjøkkenvifte. Kraftig sugeevne og stillegående drift for et behagelig inneklima.
      CozyHeat elektrisk teppe;Husholdning;https://example.com/cozyheat-elektrisk-teppe;https://example.com/images/cozyheat-elektrisk-teppe.jpg;1199;CH064;Hold deg varm på kalde kvelder med CozyHeat elektrisk teppe. Flere varmeinnstillinger og automatisk avstengning for ekstra sikkerhet.
      PowerLift garasjeheis;Verktøy;https://example.com/powerlift-garasjeheis;https://example.com/images/powerlift-garasjeheis.jpg;4999;PL065;Gjør tunge løft i garasjen enklere med PowerLift garasjeheis. Perfekt for å løfte biler, båter eller store maskiner.
      ClearView dashcam;Biltilbehør;https://example.com/clearview-dashcam;https://example.com/images/clearview-dashcam.jpg;1299;CV066;Dokumenter dine bilturer med ClearView dashcam. Opptak i full HD, bred synsvinkel og nattsyn for optimal sikkerhet.
      SmartBake ovn med WiFi;Kjøkkenutstyr;https://example.com/smartbake-ovn;https://example.com/images/smartbake-ovn.jpg;7499;SB067;Bak som en proff med SmartBake ovn. Fjernstyr temperatur og tid via app, og få perfekte resultater hver gang.
      
      Unngå å bruke spesialtegn, og hold deg til vanlig norsk skriftspråk.
      Her kommer spørsmålet til brukeren: ${userInput}
      `;
      
      

      const result = await model.generateContent(modifiedPrompt);
      const responseText = result.response.text();

      const botMessage: Message = { sender: 'bot', text: responseText };
      setConversation((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating content: ", error);
      const errorMessage: Message = { sender: 'bot', text: "Sorry, an error occurred. Please try again." };
      setConversation((prev) => [...prev, errorMessage]);
    } finally {
      setUserInput('');
      setIsLoading(false);
    }
  };

  // Allow sending the message when pressing Enter
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && userInput.trim()) {
      handleSendMessage();
    }
  };

  return (
    <div style={styles.container} className="bg-white">
      <div style={styles.conversation} className="text-black">
        {conversation.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#DCF8C6' : '#FFF',
            }}
          >
            {msg.text}
          </div>
        ))}
        {/* Dummy element to scroll into view */}
        <div ref={conversationEndRef} />
      </div>
      <div style={styles.inputContainer} className="text-black">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
          style={styles.input}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !userInput.trim()}
          style={styles.button}
        >
          Send
        </button>
      </div>
    </div>
  );
};

// Inline styles for the component
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '400px',
    margin: '20px auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif',
  },
  conversation: {
    flex: 1,
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    overflowY: 'auto',
    maxHeight: '600px', // Uses a maximum height to allow scrolling when content grows
  },
  message: {
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '80%',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  inputContainer: {
    display: 'flex',
    borderTop: '1px solid #ccc',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: 'none',
    outline: 'none',
  },
  button: {
    padding: '10px 15px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default Chatbot;
