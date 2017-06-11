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
    new Joke("Qui est le frère de Albert einstein ? Franck.."),
    new Joke("Connais-tu la blague du chauffeur d'autobus? non? moi non plus j'étais à l'arrière du bus !"),
    new Joke("Tu veux une blague à 2 balles ? Pan pan"),
    new Joke("Tu prends un fruit exotique, genre kiwi, et une vache. Tu prends les deux, ça fait la vache kiwi..."),
    new Joke("Qu'est-ce qui fait ses 8 heures par jour dans l'administration ? La machine à café."),
    new Joke("Tu connais, demande un chef d'entreprise à un ami, la différence entre ma nouvelle secrétaire et l'administration des impôts ? Non. L'administration des impôts vous suce jusqu'à l'os."),
    new Joke("La juge : Vous êtes coupable. Je vous condamne à 100 dollars d'amendes. Oh non ! Madame le juge ! Je mange pour 25 dollars d'arachides et je suis malade. Alors imaginez-vous cent dollars d'amandes : je vais en mourir ! "),
    new Joke("Quelle est la différence entre un inspecteur des impôts et un vampire? Le vampire ne suce le sang que la nuit "),
    new Joke("Monsieur et madame bar ont un fils, comment s'appelle t-il? Léni parce que lénibar. "),
    new Joke("Monsieur et Madame Bistrukla ont un fils....qui est-il? César paske césarbistrucla ! "),
    new Joke("Monsieur et Madame à la vanille please ont un fils : Douglas"),
    new Joke("Quel est le sport le plus fruité ? C'est la boxe parce que quand tu te prends une pêche en pleine poire tu tombes dans les pommes et tu peux plus ramenais ta fraise !!!"),
    new Joke("Un boxeur dit à un de ses confrères : Je me demande comment tu as fait pour être battu par ce petit gringalet qui t'arrive tout juste au menton? Ben justement, il y arrivait trop souvent ! "),
    new Joke("Comment dit-on 'rentrez chez vous' en brésilien? Troasero."),
    new Joke("Pourquoi il n'y-t-il a pas de clous au tennis? Bah, y a déja la coupe Davis !"),
    new Joke("Comment pourrait-on faire pour réussir à faire mouiller le maillot des joueurs de l'équipe de France de football ? En jouant sous la pluie !"),
    
    
    
    
];


//var question = "Quelle est la ressemblance entre les hommes et le micro-ondes? Ils se réchauffent en 15 secondes.";
var question = "Comment appelle-t-on un alcotest en terme culinaire ? Un soufflé aux amandes.";



$(document).ready(function()
{
    var session = new QiSession();
    tick();
    
    
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
                if (data.length > detctedList.length && !currentJoke.onerunning)
                {
                    questionAsked = true;
                    tts.say("Veux-tu que je te raconte une blague ?");
                }
                detctedList = data;
            });
        });
        
        memory.subscriber("WordRecognized").done(function(subscriber)
        {
            console.log("WordRecognized signal connected");
            subscriber.signal.connect(function(data)
            {
                console.log(data);
                var word = data[0];
                var confidence = data[1];
                if ((word.indexOf("blague") !== -1 || (word.indexOf("oui") !== -1 && questionAsked)) && confidence >= 0.45 && !currentJoke.onerunning)
                {
                    questionAsked = false;
                    console.log("mot blague compris");
                    DireUneBlague();
                }
            });
        });
        
        /*memory.subscriber("FaceDetected").done(function(subscriber)
        {
            console.log("subscriber facedetected connecté");
            subscriber.signal.connect(function(data)
            {
                console.log("facedetected");
                console.log(data);
            });
        });*/
        
        memory.subscriber("ALTextToSpeech/TextDone").done(function(subscriber)
        {
            subscriber.signal.connect(function(state)
            {
                if (state)
                    setTimeout(DireProchainePhrase, 2000);
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
        
        reco.setVisualExpression(true);
        
        reco.pause(false);
        reco.subscribe("test");
        console.log("Reconnaissance vocale démarrée");
    });
    
    session.service("ALFaceDetectionProxy").done(function(detection)
    {
        detctedList.setTrackingEnabled();
        console.log("Tracking enabled");
    });
});


function tick()
{

   
}

function DireUneBlague()
{
    if (!currentJoke.onerunning)
    {
        const blague = jokes[Math.floor(Math.random() * jokes.length)];
        currentJoke.joke = blague;
        console.log("blague choisie: " + blague);
        currentJoke.sentences = blague.m_joke.split("?");
        currentJoke.nextIndex = 0;
        currentJoke.onerunning = true;
        DireProchainePhrase();
    }
}

function DireProchainePhrase()
{
    if (currentJoke.nextIndex < currentJoke.sentences.length)
    {
        var phrase = currentJoke.sentences[currentJoke.nextIndex];
        console.log("phrase dite: " + phrase);
        currentJoke.nextIndex++;
        tts.say(phrase);
    }
    else
    {
        GatherFeedback();
    }
}

function GatherFeedback()
{
    if (currentJoke.onerunning)
    {
        for (var i = 0; i < detctedList.length; i++)
        {

            const id = detctedList[i];
            faceCharacteristics.analyzeFaceCharacteristics(id).done(function ()
            {
                memory.getData("PeoplePerception/Person/" + id + "/SmileProperties").done(function (data)
                {
                    if (currentJoke.onerunning)
                    {
                        //var value = (data[0] + data[1]) / 2;
                        var value = data[0] * data[1];
                        feedback.push({smile: data[0], confidence: data[1]});
                        console.log("[" + feedback.length + "] New Feedback " + value + "(" + data[0] + ", " + data[1] + ")");
                    }
                });
            });
        }
        if (feedback.length < 5)
        {
            setTimeout(GatherFeedback, 500);
        }
        else
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
            if (average >= 0.2)
                tts.say("Cette blague était drôle");
            else
                tts.say("Excusez-moi pour cette blague de merde");
            
            console.log("Fin de la blague Apréciation générale de cette blague " + currentJoke.joke.GetAverage());
            feedback.length = 0;
            currentJoke.joke = undefined;
            currentJoke.nextIndex = 0;
            currentJoke.onerunning = false;
            currentJoke.sentences.length = 0;
            

        }
    }
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
            jokes[rank] = currentBestRank;
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
