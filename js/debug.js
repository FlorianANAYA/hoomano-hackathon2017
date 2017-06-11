/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// Proxy qui gère les préférences du robot et de l'application
var preferenceManager;

var memory;

var tts;

var faceCharacteristics;

var speechRecognition;

var detctedList = [];
// liste des valeurs de sourire recueillies pour en faire une moyenne
var feedback = [];
// défini si le robot a posé la question voulez vous entendre une blague
var questionAsked = false;

var currentJoke = 
{
    joke: undefined,
    sentences: [],
    nextIndex: 0,
    onerunning: false
};

var jokes =
[
    new Joke("Comment appelle-t-on un alcotest en terme culinaire ? Un soufflé aux amandes."),
    new Joke("Qu'est ce qui fait 999 fois TIC et 1 fois TOC ? Un mille pattes avec une jambe de bois."),
    new Joke("Qui est le frère de Albert einstein ? Frranck parce que Franckeistein"),
    new Joke("Connais-tu la blague du chauffeur d'autobus? Moi non plus j'étais à l'arrière du bus !"),
    new Joke("Tu veux une blague à 2 balles ? Pan pan"),
    new Joke("Tu prends un fruit exotique, genre kiwi, et une vache. Tu prends les deux, ça fait la vache kiwi..."),
    new Joke("Qu'est-ce qui fait ses 8 heures par jour dans l'administration ? La machine à café."),
    new Joke("Quel animal fait toin toin ? un tanard."),
    new Joke("Vous êtes coupable. Je vous condamne à 100 dollars d'amendes. Oh non ! Madame le juge ! Je mange pour 25 dollars d'arachides et je suis malade. Alors imaginez-vous cent dollars d'amandes : je vais en mourir ! "),
    new Joke("Quelle est la différence entre un inspecteur des impôts et un vampire? Le vampire ne suce le sang que la nuit"),
    new Joke("Monsieur et madame bar ont un fils, comment s'appelle t-il? Léni parce que lénibar. "),
    new Joke("Monsieur et Madame Bistrukla ont un fils....qui est-il? César parce que c'est zarbi ce truc là"),
    new Joke("Monsieur et Madame à la vanille ont un fils, comment s'appelle-t-il ? Douglas parce que dou glace à la vanille"),
    new Joke("Quel est le sport le plus fruité ? C'est la boxe parce que quand tu te prends une pêche en pleine poire tu tombes dans les pommes et tu peux plus ramenais ta fraise !!!"),
    new Joke("Un boxeur dit à un de ses confrères : Je me demande comment tu as fait pour être battu par ce petit gringalet qui t'arrive tout juste au menton? Ben justement, il y arrivait trop souvent ! "),
    new Joke("Comment dit-on 'rentrez chez vous' en brésilien? Troasero."),
    new Joke("Pourquoi il n'y-t-il a pas de clous au tennis? Parce qu'il y a déja la coupe Davis !"),
    new Joke("Comment pourrait-on faire pour réussir à faire mouiller le maillot des joueurs de l'équipe de France de football ? En jouant sous la pluie !"),
    new Joke("C'est un mec il rentre dans un bar, il dit c'est moi. Mais en fait , c'est pas lui"),
    new Joke("Un cheval va à la boulangerie , bonjour je voudrais trois beignets aux pommes? Déolé nous n'en avons plus ? C'est pas grave, je suis venue en mobilette"),
    new Joke("A la piscine, un nageur se fait enguirlander parce qu'il a fait pipi dans l'eau? Mais enfin, proteste-t-il, vous exagérez, je ne suis pas le seul à faire ça ? Si, monsieur, du haut du plongeoir, vous êtes le seul! "),
    new Joke("Allô Police ! Je viens d'écraser un poulet. Que dois-je faire ? - Et bien , plumez-le et faites-le cuire à thermostat 6? - Ah bon ! Et qu'est-ce que je fais de la moto"),
    new Joke("Deux asticots se retrouvent dans une pomme :? - Tiens ! Je ne savais pas que vous habitiez le quartier !"),
    new Joke("C'est un aveugle qui rentre dans un bar, puis dans une table, puis dans une chaise"),
    new Joke("La maman d'Émilie n'est pas contente? - Regarde, le lait a débordé, je t'avais pourtant demandé de regarder ta montre!? - Mais je l'ai fait, il était exactement 8H10 quand le lait a débordé !"),
    new Joke("Une mère dit à son garçon :? -N'oublie pas que nous sommes sur terre pour travailler? - Bon, alors moi, plus tard je serai marin !"),
    new Joke("Vous êtes au volant d'une voiture et vous roulez à vitesse constante.? A votre droite, le vide...? A votre gauche, un camion de pompiers qui roule à la même vitesse et dans la même direction que vous.? Devant vous, un cochon, qui est plus gros que votre voiture !? Derrière vous, un hélicoptère qui vous suit, en rase-motte.? Le cochon et l'hélicoptère vont à la même vitesse que vous? Face à tous ces éléments, comment faites-vous pour vous arrêter ? C'est simple, vous descendez du manège !"),
    new Joke("Je suis inquiet, je vois des points noirs.? - Tu a vu l'oculiste ? - Non, des points noirs !"),
    new Joke("Une femme discute avec une amie :? - 'J'ai un mari en or.'? - 'moi, le mien, il est en taule.'"),
    new Joke("Sur le bord du Nil, trois Belges voyant un crocodile dans l'eau se mettent à lui jeter des cailloux? A un moment, le crocodile, en colère, s'approche de la rive, prêt à monter sur la berge. Deux des Belges se sauvent et montent dans un arbre. Le troisième, impassible, ne bouge pas? Les autres l'appelle et lui disent de se sauver? Alors l'autre leur répond : 'Ca va pas, une fois, j'ai pas jeté de cailloux moi.'"),
    new Joke("Une dame se présente chez le pharmacien? - 'Bonjour monsieur! je voudrais de l'acide acétylsalicylique, SVP !'? - 'Vous voulez dire de l'aspirine '? - 'Ha ! oui, c'est cela... je ne me souvenais plus du nom.'"),
    new Joke("J'ai des soucis d'argent, rien que tes études, ça me coûte une fortune!? -Et encore, moi, je ne suis pas de celles qui étudient le plus!"),
    new Joke("Le père de David s'étonne de ne pas avoir encore reçu le bulletin scolaire de son fils et lui en demande la raison :? - Et ton bulletin il est pas encore arrivé? - Si, si mais je l'ai prêté a Paul pour qu'il fasse peur a son père !"),
    new Joke("La maîtresse demande à Nicolas :? - Conjugue-moi le verbe savoir à tous les temps.? - Je sais qu'il pleut, je sais qu'il fera beau, je sais qu'il neige."),
    new Joke("Deux étudiants en ingénierie marchent le long de leur campus lorsque l'un des deux dit a l'autre :? - Ou est-ce que tu as trouvé ce vélo ? - Ben en fait, alors que je marchais, hier, et que j'étais dans mes pensées, je croise une super nana en vélo qui s'arrête devant moi, pose son vélo par terre, se déshabille entièrement et me dit : - Prends ce que tu veux !? - Tu as eu raison, les vêtements auraient certainement été trop serrés !"),
    new Joke("La maîtresse demande de construire une phrase avec l'adjectif épithète.? Nicolas lève le doigt et dit :? Aujourd'hui il pleut, épithète demain, il fera beau !"),
    new Joke("Une étudiante en médecine répond aux questions du professeur:? - Qu'est ce qui provoque la transpiration? - Vos questions, Monsieur, répond la jeune fille."),
    new Joke("À quoi reconnaît-on qu'une voiture n'est plus cotée à l'argus ? Il y a un autocollant «OM Champion de France» sur la vitre arrière."),
    new Joke("A quoi reconnaît-on un motard heureux ? Aux moucherons collés sur ses dents."),
    new Joke("Linux a un noyau, windows a des pépins !"),
    new Joke("Un jour, je suis sorti de ma chambre et j'ai découvert que ma famille avait déménagé."),
    new Joke("Le manuel disait « nécessite Windows XP ou mieux » j'ai donc installé Linux."),
    new Joke("Le jour ou microsoft inventera un truc qui ne plante pas, ce sera un clou !"),
    new Joke("Quand la rame est pleine, c'est souvent un problème de bus."),
    new Joke("Un chef de projet, c'est quelqu'un qui pense qu'avec 9 femmes, on peut faire un bébé en un mois."),
    new Joke("Quelle est la mamie qui fait peur aux voleurs ? Mamie Traillette !"),
    new Joke("Avec quoi ramasse t'on la papaye ? Avec une foufourche. "),
    new Joke("Combien faut-il d'ingénieurs pour changer une ampoule chez Microsoft ? Aucun, tout le monde reste dans le noir et Billou décide que c'est le nouveau standard. "),
    new Joke("Bill Gates va au paradis et dieu lui dit : - Fils, vient t'asseoir à ma droite. Bill répond :? - Primo, je ne suis pas votre fils et Deuzio, qu'est-ce que vous faites assis à ma place ?!"),
    new Joke("Combien de techniciens de chez Microsoft ça prend pour changer une ampoule électrique? Trois deux pour tenir l'échelle et un pour visser l'ampoule dans le robinet. "),
    new Joke("Combien de Vice-présidents de chez Microsoft ça prend pour changer une ampoule électrique? - Huit un pour changer l'ampoule, et sept pour être sûr que Microsoft empoche bien deux dollars pour toute ampoule changée à travers le monde."),
    new Joke("Microsoft a sorti une nouvelle console de jeu? On a pu apprécier la manette ergonomique et pratique, puisqu’elle ne comporte que 3 boutons Ctrl, Alt et Suppr."),
    //new Joke(""),
    //new Joke(""),
    
    
];


var TEXTS =
{
    DEMANDER_UNE_BLAGUE:
    [
        "Si quelqu'un veut une blague, demandez-moi",
        "J'ai les meilleurs blagues",
        "Approchez-vous",
        "Approchez-vous j'ai de super blague",
        "Quelqu'un veut gouter à mon humour robotique ?",
        "UnMute, dealer de blague de qualité depuis 1973"
    ],
    TU_VEUX_UNE_BLAGUE:
    [
        "Veux-tu que je te raconte une blague",
        "Hey j'ai une super blague",
        "Tu veux une blague nulle ?",
        "Veux-tu une blague de qualité ?"
    ],
    EN_FAIT_NON:
    [
        "Nan laisse tomber elle est trop naze",
        "En fait la fin est nulle laisse tomber",
        "Attent attend, la fin est trop nulle, je peux pas la dire",
        
    ],
    BLAGUE_DROLE:
    [
        "Qui trouve ça drôle à part toi",
        "Moi aussi j'ai bien aimé",
        "C'est ouf les humains ont vraiment un humour de merde",
        "Wow vus rigolez à ça ? Ok.",
        "J'ai pas trouvé ça drôle moi mais bon",
        "Faut vraiment avoir un humour de brocolis pour rigoler à sa",
        
    ],
    BLAGUE_TRES_DROLE:
    [
        "Arrêtez de rire maintenant",
        "Qu'est-ce qu'on se marre",
        "Je commence à croire que mes blagues sont drôles",
        "Tu as vraiment un rire de merde",
        "Personne n'a rie à ça avant toi, c'est bizarre"
    ],
    BLAGUE_PAS_DROLE:
    [
        "Ça paraissait plus drôle avant que je la dise",
        "Mais elle est pourrie en fait",
        "Mais vous n'avez aucun humour",
        "J'ai honte d'avoir raconté ça",
        "Comment j'ai pu trouver ça drôle la première fois",
        "C'est maintenant qu'il faut rigoler normalement",
        "Excusez-moi pour cette blague de merde",
        "Désolé, mes autres blagues sont mieux",
        "Mes créateurs ont visiblement beaucoup plus d'humour que vous",
        "C'est pas sympa de me laisser faire un bide comme ça",
        "Promis j'en ai des plus drôle",
        "Mon humour est trop intellectuel pour que tu le comprenne. Désolé, je vais baisser le niveau",
        "Les gens normaux rigolent à ce genre de blague d'habitude",
        
    ],
    UNE_AUTRE:
    [
        "Une autre ?",
        "En veux-tu une autre ?",
        "Une autre blague nulle ?"
    ],
    JE_RECOMMENCE:
    [
        "Tu ne l'as pas compris je pense, je recomence",
        "Tu ne l'as pas compris, je la refais",
        "Attend j'avais pas la bonne intonation"
    ],
    PLUS_PERSONNE:
    [
        "Vous êtes passé où ?",
        "Pourquoi tout le monde est parti ?",
        "Vous êtes parti où ?",
        "REVENEZ"
    ]
};

const STATES =
{
    // le robot attend une blague
    WAITING_FOR_JOKE: 1,
    // le robot attend une blague et a dit le phrase TEXTS.TU_VEUX_UNE_BLAGUE
    WAITING_FOR_JOKE_WITH_QUESTION:2,
    // le robot choisi une blague et passe à l'état TELLING pour commencer à la dire
    START_TELLING: 9,
    // le robot est en train de raconter a blague
    TELLING: 3,
    // le robot a décidé d'annuler la blague parce qu'elle est trop nulle
    // Il est en train de dire du texte
    CANCELLING: 4,
    // le robot prépare le récupération de feedback
    START_GATHERING_FEEDBACK: 10,
    // le robot est en train de déterminer l'impact de la blague sur l'humain
    GATHERING_FEEDBACK: 5,
    // le robot a fini de récupérer les feedback, il les synthétise
    END_FEEDBACK: 11,
    // le robot est en train de dire qu'il pense que l'utilisateur n'a 
    // pas compris, il va redire la blague
    NOT_UNDERSTOOD: 6,
    // le robot est en train de dire si la blgue est drole en fct des feedback
    IS_THE_JOKE_FUNNY: 7,
    // LE robot propose une autre blague, le prochain état est donc WAITING_FOR_JOKE_WITH_QUESTION
    AN_OTHER: 8
    
    
    
};

var etat = STATES.WAITING_FOR_JOKE;

var nbTextLeft = 0;




$(document).ready(function()
{
    var session = new QiSession();
    
    setTimeout(tick, 5000);
    
    session.service("ALTextToSpeech").done(function(localtts)
    {
        //tts.say("");
        tts = localtts;
        tts.setLanguage("French");
    });
    
    session.service("ALMemory").done(function(localmemory)
    {
        memory = localmemory;
        console.log("ALMemory chargé");
        memory.subscriber("ALMood/attentionChanged").done(function(subscriber)
        {
            console.log("Subscriber subscribé");
            subscriber.signal.connect(function(emotion)
            {
                console.log("AttentionChanged : " + emotion);
            });
        });
        
        memory.subscriber("PeoplePerception/PeopleList").done(function(subscriber)
        {
            subscriber.signal.connect(function(data)
            {
                console.log("PeopleList");
                console.log(data);
                if (data.length > detctedList.length && etat === STATES.WAITING_FOR_JOKE)
                {
                    etat = STATES.WAITING_FOR_JOKE_WITH_QUESTION;
                    say(TEXTS.TU_VEUX_UNE_BLAGUE);
                }
                detctedList = data;
                if (detctedList.length === 0)
                {
                    say(TEXTS.PLUS_PERSONNE);
                    etat = STATES.WAITING_FOR_JOKE;
                }
            });
        });
        
        memory.subscriber("WordRecognized").done(function(subscriber)
        {
            console.log("WordRecognized signal connected");
            subscriber.signal.connect(function(data)
            {
                var word = data[0];
                var confidence = data[1];
                console.log("mot reconnu: '" + word + "' à " + Math.round(confidence * 10000)/100 + "% avec " + detctedList.length + " personnes");
                if ((etat === STATES.WAITING_FOR_JOKE || etat === STATES.WAITING_FOR_JOKE_WITH_QUESTION)
                        && detctedList.length > 0)
                {
                    // si le mot est blague ou le mot est blague et la question a été posé
                    // et le robot est sur du mot à au moins 45%
                    if ((word.indexOf("blague") !== -1 || (word.indexOf("oui") !== -1 && etat === STATES.WAITING_FOR_JOKE_WITH_QUESTION))
                            && confidence >= 0.47)
                    {
                        etat = STATES.START_TELLING;
                        console.log("mot blague compris");
                        // DireUneBlague();
                    }
                }
                
            });
        });
        
        memory.subscriber("ALTextToSpeech/TextDone").done(function(subscriber)
        {
            subscriber.signal.connect(function(state)
            {
                if (state)
                {
                    nbTextLeft--;
                    if (nbTextLeft < 0)
                        nbTextLeft = 0;
                }
            });
        });
        
        
    });
    
    session.service("ALFaceCharacteristics").done(function(localfc)
    {
        faceCharacteristics = localfc;
    });
    
    session.service("ALSpeechRecognition").done(function(reco)
    {
        speechRecognition = reco;
        reco.pause(true);
        reco.setLanguage("French");
        // vocabulaire et word spotting 
        reco.setVocabulary(["blague", "oui"], true);
        
        reco.setVisualExpression(false);
        
        reco.pause(false);
        reco.subscribe("test");
        console.log("Reconnaissance vocale démarrée");
    });
});

function tick()
{
    setTimeout(tick, 100);
    if (nbTextLeft > 0)
        return;
    
    if (etat === STATES.WAITING_FOR_JOKE)
    {
        if (new Date().valueOf() % 200 === 0 && Math.random() < 0.3)
            say(TEXTS.DEMANDER_UNE_BLAGUE);
        $("#percent").text("");
        EraseText();
    }
    else if (etat === STATES.WAITING_FOR_JOKE_WITH_QUESTION)
    {
        $("#percent").text("");
        EraseText();
    }
    else if (etat === STATES.START_TELLING)
    {
        DireUneBlague();
    }
    else if (etat === STATES.TELLING)
    {
        // le robot n'a plus rien à dire
        if (nbTextLeft <= 0)
        {
            // il reste des blagues à dire
            if (currentJoke.nextIndex < currentJoke.sentences.length)
            {
                // si la blague a un mauvais score, elle a une chance d'être annulée
                if (currentJoke.joke.GetAverage() < 0.5
                        && Math.random() > currentJoke.joke.GetAverage() + 0.3
                        && currentJoke.nextIndex > 0)
                {
                    console.log("Blague annulée à " + currentJoke.joke.GetAverage());
                    say(TEXTS.EN_FAIT_NON);
                    etat = STATES.CANCELLING;
                }
                else
                {
                    console.log("Blague pas annulée");
                    var phrase = currentJoke.sentences[currentJoke.nextIndex];
                    currentJoke.nextIndex++;
                    say(phrase);
                    AppendText(phrase);
                }
            }
            else
            {
                console.log("la blague a fini d'être dite");
                etat = STATES.START_GATHERING_FEEDBACK;
            }
        }
    }
    else if (etat === STATES.CANCELLING)
    {
        if (nbTextLeft <= 0)
        {
            say(TEXTS.UNE_AUTRE);
            etat = STATES.AN_OTHER;
        }
    }
    else if (etat === STATES.START_GATHERING_FEEDBACK)
    {
        feedback.length = 0;
        etat = STATES.GATHERING_FEEDBACK;
    }
    else if (etat === STATES.GATHERING_FEEDBACK)
    {
        if (detctedList.length === 0)
        {
            say(TEXTS.PLUS_PERSONNE);
            etat = STATES.WAITING_FOR_JOKE;
        }
        else
        {
            for (var i = 0; i < detctedList.length; i++)
            {
                const id = detctedList[i];
                faceCharacteristics.analyzeFaceCharacteristics(id).done(function ()
                {
                    memory.getData("PeoplePerception/Person/" + id + "/SmileProperties").done(function (data)
                    {
                        if (etat === STATES.GATHERING_FEEDBACK)
                        {
                            feedback.push({smile: data[0], confidence: data[1]});
                            console.log("[" + feedback.length + "] New Feedback Smile=" + data[0] + ", Confidence=" + data[1]);
                        }
                    });
                });
            }
            if (feedback.length > 10)
            {
                etat = STATES.END_FEEDBACK;
            }
        }
    }
    else if (etat === STATES.END_FEEDBACK)
    {
        console.log("Assez de feedback");
        var total = 0;
        var coef = 0;
        var average = 0;
        for (var i in feedback)
        {
            total += feedback[i].smile * feedback[i].confidence;
            coef += feedback[i].confidence;
        }
        average = total / coef;
        currentJoke.joke.AddMark(average);
        console.log("Moyenne de cette blague=" + average);
        $("#percent").text("");
        $("#percent").append("Vous avez ris à <br>" + Math.round(average * 10000)/100 + "%");
        var notunderstood = false;
        if (average >= 0.6)
            say(TEXTS.BLAGUE_TRES_DROLE);
        else if (average >= 0.3)
            say(TEXTS.BLAGUE_DROLE);
        else
        {
            if (Math.random() < 0.15)
                notunderstood = true;
            else
                say(TEXTS.BLAGUE_PAS_DROLE);
        }
        
        if (notunderstood)
        {
            say(TEXTS.JE_RECOMMENCE);
            etat = STATES.NOT_UNDERSTOOD;
        }
        else
        {
            etat = STATES.IS_THE_JOKE_FUNNY;
        }
            

        console.log("Fin de la blague Apréciation générale de cette blague " + currentJoke.joke.GetAverage());
    }
    else if (etat === STATES.NOT_UNDERSTOOD)
    {
        if (nbTextLeft <= 0)
        {
            etat = STATES.START_TELLING;
            DireUneBlague(currentJoke.joke);
        }
    }
    else if (etat === STATES.IS_THE_JOKE_FUNNY)
    {
        if (nbTextLeft <= 0)
        {
            feedback.length = 0;
            currentJoke.joke = undefined;
            currentJoke.nextIndex = 0;
            currentJoke.onerunning = false;
            currentJoke.sentences.length = 0;
            console.log("System reset");
            etat = STATES.AN_OTHER;
            say(TEXTS.UNE_AUTRE);
        }
    }
    else if (etat === STATES.AN_OTHER)
    {
        if (nbTextLeft <= 0)
        {
            etat = STATES.WAITING_FOR_JOKE_WITH_QUESTION;
        }
    }
}


function DireUneBlague(joke)
{
    if (etat === STATES.START_TELLING)
    {
        if (Joke.prototype.isPrototypeOf(joke))
            currentJoke.joke = joke;
        else
            currentJoke.joke = jokes[Math.floor(Math.random() * jokes.length)];
        
        EraseText();
        console.log("blague choisie: " + currentJoke.joke.m_joke);
        currentJoke.sentences = currentJoke.joke.m_joke.split("?");
        currentJoke.nextIndex = 0;
        etat = STATES.TELLING;
    }
}

function EraseText()
{
    $("#blague").text("");
}


function AppendText(text)
{
    if (typeof text === "string")
    {
        $('#blague').append(text + "<br>");
    }
    //$("#blague").val($("#blague").val() + text + "\n");
}



var sortJokes = function()
{
    for (var rank = 0; rank < jokes.length - 1; rank++)
    {
        var currentBest = jokes[rank];
        var currentBestRank = rank;
        for (var i = rank + 1; i < jokes.length; i++)
        {
            var testedJoke = jokes[i];
            if (testedJoke.GetAverage() > currentBest.GetAverage())
            {
                currentBest = testedJoke;
                currentBestRank = i;
            }
            
        }
        if (rank !== currentBestRank)
        {
            jokes[currentBestRank] = jokes[rank];
            jokes[rank] = currentBest;
        }
    }
    
    for (var i = 0; i < jokes.length; i++)
    {
        try
        {
            console.log("[" + i + "]" + jokes[i].GetAverage() + " - " + jokes[i].m_joke);
        }
        catch (err)
        {
            
        }
    }
};

function say(message)
{
    if( Object.prototype.toString.call( message ) === '[object Array]' )
    {
        say(message[Math.floor(Math.random() * message.length)]);
    }
    else if (typeof message === "string")
    {
        nbTextLeft++;
        tts.say(message);
        console.log("Pepper: " + message);
    }
}












var ips = [//"192.168.101.58", 
    "192.168.101.77",
    "192.168.101.57",
    "192.168.101.76",
    //"192.168.101.64"
];
var sessions = {};
var ttss = {};

function killall()
{
    
    
    for (var i in ips)
    {
        const ip = ips[i];
        sessions[ip] = new QiSession(ip);
        sessions[ip].service("ALTextToSpeech").done(function(ltts)
        {
            console.log(ip + " est prêt");
            ttss[ip] = ltts;
            //ltts.setVolume(1.0);
        });
        sessions[ip].service("ALAudioDevice").done(function(dev)
        {
            dev.setOutputVolume(100);
        });
    }
    waitforkill();
}

function waitforkill()
{
    console.log(ttss.length + " robots prêts");
    if (Object.keys(ttss).length >= Object.keys(ips).length)
    {
        console.log("tous les robots sont prêts");
        kill();
    }
    else
        setTimeout(waitforkill, 2000);
}

function kill()
{
    for (var i in ttss)
    {
        ttss[i].say("Continue tu es super drole");
    }
    setTimeout(kill, 1500);
}
