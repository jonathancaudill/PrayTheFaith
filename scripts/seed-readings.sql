-- Seed scripture and meditative readings for each rosary mystery.
-- Translations: RSVCE (Revised Standard Version Catholic Edition), NABRE (New American Bible Revised Edition), NRSVCE where noted.
-- Run after schema.sql.

-- JOYFUL MYSTERIES

-- 1. The Annunciation (joy_1)
INSERT INTO readings (mystery_id, reference, text) VALUES
('joy_1', 'Luke 1:26-28 (RSVCE)', 'In the sixth month the angel Gabriel was sent from God to a city of Galilee named Nazareth, to a virgin betrothed to a man whose name was Joseph, of the house of David; and the virgin''s name was Mary. And he came to her and said, "Hail, full of grace, the Lord is with you!"'),
('joy_1', 'Luke 1:30-35 (RSVCE)', 'And the angel said to her, "Do not be afraid, Mary, for you have found favor with God. And behold, you will conceive in your womb and bear a son, and you shall call his name Jesus. He will be great, and will be called the Son of the Most High; and the Lord God will give to him the throne of his father David, and he will reign over the house of Jacob for ever; and of his kingdom there will be no end." And Mary said to the angel, "How can this be, since I have no husband?" And the angel said to her, "The Holy Spirit will come upon you, and the power of the Most High will overshadow you; therefore the child to be born will be called holy, the Son of God."'),
('joy_1', 'Luke 1:38 (RSVCE)', 'And Mary said, "Behold, I am the handmaid of the Lord; let it be to me according to your word." And the angel departed from her.'),
('joy_1', 'Meditation', 'St. Bernard of Clairvaux: Mary''s "fiat" is the model of every Christian response to God. In her "Behold, I am the handmaid of the Lord" we learn to surrender our will to his and to welcome Christ into the world through our own lives.');

-- 2. The Visitation (joy_2)
INSERT INTO readings (mystery_id, reference, text) VALUES
('joy_2', 'Luke 1:39-42 (RSVCE)', 'In those days Mary arose and went with haste into the hill country, to a city of Judah, and she entered the house of Zechariah and greeted Elizabeth. And when Elizabeth heard the greeting of Mary, the babe leaped in her womb; and Elizabeth was filled with the Holy Spirit and she exclaimed with a loud cry, "Blessed are you among women, and blessed is the fruit of your womb!"'),
('joy_2', 'Luke 1:43-45 (RSVCE)', 'And why is this granted me, that the mother of my Lord should come to me? For behold, when the voice of your greeting came to my ears, the babe in my womb leaped for joy. And blessed is she who believed that there would be a fulfilment of what was spoken to her from the Lord."'),
('joy_2', 'Luke 1:46-49 (RSVCE) – Magnificat', 'And Mary said, "My soul magnifies the Lord, and my spirit rejoices in God my Savior, for he has regarded the low estate of his handmaiden. For behold, henceforth all generations will call me blessed; for he who is mighty has done great things for me, and holy is his name."');

-- 3. The Nativity (joy_3)
INSERT INTO readings (mystery_id, reference, text) VALUES
('joy_3', 'Luke 2:4-7 (RSVCE)', 'And Joseph also went up from Galilee, from the city of Nazareth, to Judea, to the city of David, which is called Bethlehem, because he was of the house and lineage of David, to be enrolled with Mary, his betrothed, who was with child. And while they were there, the time came for her to be delivered. And she gave birth to her first-born son and wrapped him in swaddling cloths, and laid him in a manger, because there was no place for them in the inn.'),
('joy_3', 'Luke 2:8-12 (RSVCE)', 'And in that region there were shepherds out in the field, keeping watch over their flock by night. And an angel of the Lord appeared to them, and the glory of the Lord shone around them, and they were filled with fear. And the angel said to them, "Be not afraid; for behold, I bring you good news of a great joy which will come to all the people; for to you is born this day in the city of David a Savior, who is Christ the Lord. And this will be a sign for you: you will find a babe wrapped in swaddling cloths and lying in a manger."'),
('joy_3', 'Luke 2:13-14 (RSVCE)', 'And suddenly there was with the angel a multitude of the heavenly host praising God and saying, "Glory to God in the highest, and on earth peace among men with whom he is pleased!"'),
('joy_3', 'Luke 2:19 (RSVCE)', 'But Mary kept all these things, pondering them in her heart.');

-- 4. The Presentation (joy_4)
INSERT INTO readings (mystery_id, reference, text) VALUES
('joy_4', 'Luke 2:22-24 (NABRE)', 'When the days were completed for their purification according to the law of Moses, they took him up to Jerusalem to present him to the Lord, just as it is written in the law of the Lord, "Every male that opens the womb shall be consecrated to the Lord," and to offer the sacrifice of "a pair of turtledoves or two young pigeons," in accordance with the dictate in the law of the Lord.'),
('joy_4', 'Luke 2:25-32 (NABRE) – Simeon', 'Now there was a man in Jerusalem whose name was Simeon. This man was righteous and devout, awaiting the consolation of Israel, and the holy Spirit was upon him. It had been revealed to him by the holy Spirit that he should not see death before he had seen the Messiah of the Lord. He came in the Spirit into the temple; and when the parents brought in the child Jesus to perform the custom of the law in regard to him, he took him into his arms and blessed God, saying: "Now, Master, you may let your servant go in peace, according to your word, for my eyes have seen your salvation, which you prepared in sight of all the peoples, a light for revelation to the Gentiles, and glory for your people Israel."'),
('joy_4', 'Luke 2:34-35 (NABRE)', 'Simeon blessed them and said to Mary his mother, "Behold, this child is destined for the fall and rise of many in Israel, and to be a sign that will be contradicted—and you yourself a sword will pierce—so that the thoughts of many hearts may be revealed."');

-- 5. The Finding in the Temple (joy_5)
INSERT INTO readings (mystery_id, reference, text) VALUES
('joy_5', 'Luke 2:41-47 (NABRE)', 'Each year his parents went to Jerusalem for the feast of Passover, and when he was twelve years old, they went up according to festival custom. After they had completed its days, as they were returning, the boy Jesus remained behind in Jerusalem, but his parents did not know it. Thinking that he was in the caravan, they journeyed for a day and looked for him among their relatives and acquaintances, but not finding him, they returned to Jerusalem to look for him. After three days they found him in the temple, sitting in the midst of the teachers, listening to them and asking them questions, and all who heard him were astounded at his understanding and his answers.'),
('joy_5', 'Luke 2:48-50 (NABRE)', 'When his parents saw him, they were astonished, and his mother said to him, "Son, why have you done this to us? Your father and I have been looking for you with great anxiety." And he said to them, "Why were you looking for me? Did you not know that I must be in my Father''s house?" But they did not understand what he said to them.'),
('joy_5', 'Luke 2:51-52 (NABRE)', 'He went down with them and came to Nazareth, and was obedient to them; and his mother kept all these things in her heart. And Jesus advanced in wisdom and age and favor before God and man.');

-- SORROWFUL MYSTERIES

-- 1. The Agony in the Garden (sorrow_1)
INSERT INTO readings (mystery_id, reference, text) VALUES
('sorrow_1', 'Matthew 26:36-39 (RSVCE)', 'Then Jesus went with them to a place called Gethsemane, and he said to his disciples, "Sit here, while I go yonder and pray." And taking with him Peter and the two sons of Zebedee, he began to be sorrowful and troubled. Then he said to them, "My soul is very sorrowful, even to death; remain here, and watch with me." And going a little farther he fell on his face and prayed, "My Father, if it be possible, let this cup pass from me; nevertheless, not as I will, but as thou wilt."'),
('sorrow_1', 'Matthew 26:40-42 (RSVCE)', 'And he came to the disciples and found them sleeping; and he said to Peter, "So, could you not watch with me one hour? Watch and pray that you may not enter into temptation; the spirit indeed is willing, but the flesh is weak." Again, for the second time, he went away and prayed, "My Father, if this cannot pass unless I drink it, thy will be done."'),
('sorrow_1', 'Luke 22:43-44 (RSVCE)', 'And there appeared to him an angel from heaven, strengthening him. And being in an agony he prayed more earnestly; and his sweat became like great drops of blood falling down upon the ground.');

-- 2. The Scourging at the Pillar (sorrow_2)
INSERT INTO readings (mystery_id, reference, text) VALUES
('sorrow_2', 'John 19:1-3 (RSVCE)', 'Then Pilate took Jesus and scourged him. And the soldiers plaited a crown of thorns, and put it on his head, and arrayed him in a purple robe; they came up to him, saying, "Hail, King of the Jews!" and struck him with their hands.'),
('sorrow_2', 'Isaiah 53:4-5 (RSVCE)', 'Surely he has borne our griefs and carried our sorrows; yet we esteemed him stricken, smitten by God, and afflicted. But he was wounded for our transgressions, he was bruised for our iniquities; upon him was the chastisement that made us whole, and with his stripes we are healed.'),
('sorrow_2', 'Meditation', 'By his stripes we are healed. In the scourging, Christ takes upon himself the weight of human sin and violence, so that we might be freed from the wounds we inflict and receive.');

-- 3. The Crowning with Thorns (sorrow_3)
INSERT INTO readings (mystery_id, reference, text) VALUES
('sorrow_3', 'Matthew 27:27-31 (RSVCE)', 'Then the soldiers of the governor took Jesus into the praetorium, and they gathered the whole battalion before him. And they stripped him and put a scarlet robe upon him, and plaiting a crown of thorns they put it on his head, and put a reed in his right hand. And kneeling before him they mocked him, saying, "Hail, King of the Jews!" And they spat upon him, and took the reed and struck him on the head. And when they had mocked him, they stripped him of the robe, and put his own clothes on him, and led him away to crucify him.'),
('sorrow_3', 'John 19:4-5 (RSVCE)', 'Pilate went out again, and said to them, "See, I am bringing him out to you, that you may know that I find no crime in him." So Jesus came out, wearing the crown of thorns and the purple robe. Pilate said to them, "Behold the man!"'),
('sorrow_3', 'Meditation', 'The crown of thorns reveals the true King: he reigns not by power but by love, not by force but by suffering. We are called to reject the world''s crowns and to share in his humility.');

-- 4. The Carrying of the Cross (sorrow_4)
INSERT INTO readings (mystery_id, reference, text) VALUES
('sorrow_4', 'John 19:17 (RSVCE)', 'So they took Jesus, and he went out, bearing his own cross, to the place called the place of a skull, which is called in Hebrew Golgotha.'),
('sorrow_4', 'Luke 23:26 (NABRE)', 'As they led him away they took hold of a certain Simon, a Cyrenian, who was coming in from the country; and after laying the cross on him, they made him carry it behind Jesus.'),
('sorrow_4', 'Luke 23:27-28 (NABRE)', 'A large crowd of people followed Jesus, including many women who mourned and lamented him. Jesus turned to them and said, "Daughters of Jerusalem, do not weep for me; weep instead for yourselves and for your children."'),
('sorrow_4', 'Matthew 16:24 (RSVCE)', 'Then Jesus told his disciples, "If any man would come after me, let him deny himself and take up his cross and follow me."');

-- 5. The Crucifixion (sorrow_5)
INSERT INTO readings (mystery_id, reference, text) VALUES
('sorrow_5', 'John 19:25-27 (RSVCE)', 'Standing by the cross of Jesus were his mother, and his mother''s sister, Mary the wife of Clopas, and Mary Magdalene. When Jesus saw his mother, and the disciple whom he loved standing near, he said to his mother, "Woman, behold, your son!" Then he said to the disciple, "Behold, your mother!" And from that hour the disciple took her to his own home.'),
('sorrow_5', 'Luke 23:46 (RSVCE)', 'Then Jesus, crying with a loud voice, said, "Father, into thy hands I commit my spirit!" And having said this he breathed his last.'),
('sorrow_5', 'John 19:28-30 (RSVCE)', 'After this Jesus, knowing that all was now finished, said (to fulfil the scripture), "I thirst." A bowl full of vinegar stood there; so they put a sponge full of the vinegar on hyssop and held it to his mouth. When Jesus had received the vinegar, he said, "It is finished"; and he bowed his head and gave up his spirit.'),
('sorrow_5', 'Matthew 27:51-54 (RSVCE)', 'And behold, the curtain of the temple was torn in two, from top to bottom; and the earth shook, and the rocks were split; the tombs also were opened. When the centurion and those who were with him, keeping watch over Jesus, saw the earthquake and what took place, they were filled with awe, and said, "Truly this was the Son of God!"');

-- GLORIOUS MYSTERIES

-- 1. The Resurrection (glorious_1)
INSERT INTO readings (mystery_id, reference, text) VALUES
('glorious_1', 'Matthew 28:1-6 (NRSVCE)', 'After the sabbath, as the first day of the week was dawning, Mary Magdalene and the other Mary went to see the tomb. And suddenly there was a great earthquake; for an angel of the Lord, descending from heaven, came and rolled back the stone and sat on it. His appearance was like lightning, and his clothing white as snow. For fear of him the guards shook and became like dead men. But the angel said to the women, "Do not be afraid; I know that you are looking for Jesus who was crucified. He is not here; for he has been raised, as he said. Come, see the place where he lay."'),
('glorious_1', 'Matthew 28:8-10 (NRSVCE)', 'So they left the tomb quickly with fear and great joy, and ran to tell his disciples. Suddenly Jesus met them and said, "Greetings!" And they came to him, took hold of his feet, and worshiped him. Then Jesus said to them, "Do not be afraid; go and tell my brothers to go to Galilee; there they will see me."'),
('glorious_1', '1 Corinthians 15:3-4 (RSVCE)', 'For I delivered to you as of first importance what I also received, that Christ died for our sins in accordance with the scriptures, that he was buried, that he was raised on the third day in accordance with the scriptures.');

-- 2. The Ascension (glorious_2)
INSERT INTO readings (mystery_id, reference, text) VALUES
('glorious_2', 'Acts 1:6-9 (NRSVCE)', 'So when they had come together, they asked him, "Lord, is this the time when you will restore the kingdom to Israel?" He replied, "It is not for you to know the times or periods that the Father has set by his own authority. But you will receive power when the Holy Spirit has come upon you; and you will be my witnesses in Jerusalem, in all Judea and Samaria, and to the ends of the earth." When he had said this, as they were watching, he was lifted up, and a cloud took him out of their sight.'),
('glorious_2', 'Acts 1:10-11 (NRSVCE)', 'While he was going and they were gazing up toward heaven, suddenly two men in white robes stood by them. They said, "Men of Galilee, why do you stand looking up toward heaven? This Jesus, who has been taken up from you into heaven, will come in the same way as you saw him go into heaven."'),
('glorious_2', 'Colossians 3:1-2 (RSVCE)', 'If then you have been raised with Christ, seek the things that are above, where Christ is, seated at the right hand of God. Set your minds on things that are above, not on things that are on earth.');

-- 3. The Descent of the Holy Spirit (glorious_3)
INSERT INTO readings (mystery_id, reference, text) VALUES
('glorious_3', 'Acts 2:1-4 (NABRE)', 'When the time for Pentecost was fulfilled, they were all in one place together. And suddenly there came from the sky a noise like a strong driving wind, and it filled the entire house in which they were. Then there appeared to them tongues as of fire, which parted and came to rest on each one of them. And they were all filled with the holy Spirit and began to speak in different tongues, as the Spirit enabled them to proclaim.'),
('glorious_3', 'Acts 2:14, 36-38 (NABRE)', 'Then Peter stood up with the Eleven, raised his voice, and proclaimed to them: "Let the whole house of Israel know for certain that God has made both Lord and Messiah, this Jesus whom you crucified." Now when they heard this, they were cut to the heart, and they asked Peter and the other apostles, "What are we to do, my brothers?" Peter said to them, "Repent and be baptized, every one of you, in the name of Jesus Christ for the forgiveness of your sins; and you will receive the gift of the holy Spirit."'),
('glorious_3', 'Galatians 5:22-23 (RSVCE)', 'But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control; against such there is no law.');

-- 4. The Assumption (glorious_4)
INSERT INTO readings (mystery_id, reference, text) VALUES
('glorious_4', 'Revelation 12:1 (NRSVCE)', 'A great portent appeared in heaven: a woman clothed with the sun, with the moon under her feet, and on her head a crown of twelve stars.'),
('glorious_4', 'Luke 1:46-48 (RSVCE)', 'And Mary said, "My soul magnifies the Lord, and my spirit rejoices in God my Savior, for he has regarded the low estate of his handmaiden. For behold, henceforth all generations will call me blessed."'),
('glorious_4', 'Meditation', 'The Church has always believed that the Mother of God, the new Eve, was taken up body and soul into heavenly glory at the end of her earthly life. She is the firstfruit of the resurrection and our advocate before her Son.');

-- 5. The Coronation of Mary (glorious_5)
INSERT INTO readings (mystery_id, reference, text) VALUES
('glorious_5', 'Revelation 12:1 (NRSVCE)', 'A great portent appeared in heaven: a woman clothed with the sun, with the moon under her feet, and on her head a crown of twelve stars.'),
('glorious_5', 'Judith 15:9-10 (NABRE)', 'Then Joakim the high priest and the entire senate of Israel came to congratulate Judith and to thank her. They said, "You are the glory of Jerusalem! You are the great pride of Israel! You are the great boast of our nation!"'),
('glorious_5', 'Meditation', 'Mary is crowned Queen of Heaven and Earth. As mother of the King of kings, she intercedes for us. We honor her and ask her prayers, that we may one day share in the glory of her Son.');

-- LUMINOUS MYSTERIES

-- 1. The Baptism of Jesus (luminous_1)
INSERT INTO readings (mystery_id, reference, text) VALUES
('luminous_1', 'Matthew 3:13, 16-17 (RSVCE)', 'Then Jesus came from Galilee to the Jordan to John, to be baptized by him. And when Jesus was baptized, he went up immediately from the water, and behold, the heavens were opened and he saw the Spirit of God descending like a dove, and alighting on him; and lo, a voice from heaven, saying, "This is my beloved Son, with whom I am well pleased."'),
('luminous_1', 'Matthew 3:11 (RSVCE)', 'I baptize you with water for repentance, but he who is coming after me is mightier than I, whose sandals I am not worthy to carry; he will baptize you with the Holy Spirit and with fire.'),
('luminous_1', 'Romans 6:3-4 (RSVCE)', 'Do you not know that all of us who have been baptized into Christ Jesus were baptized into his death? We were buried therefore with him by baptism into death, so that as Christ was raised from the dead by the glory of the Father, we too might walk in newness of life.');

-- 2. The Wedding at Cana (luminous_2)
INSERT INTO readings (mystery_id, reference, text) VALUES
('luminous_2', 'John 2:1-5 (NABRE)', 'On the third day there was a wedding in Cana in Galilee, and the mother of Jesus was there. Jesus and his disciples were also invited to the wedding. When the wine ran short, the mother of Jesus said to him, "They have no wine." Jesus said to her, "Woman, how does your concern affect me? My hour has not yet come." His mother said to the servers, "Do whatever he tells you."'),
('luminous_2', 'John 2:6-10 (NABRE)', 'Now there were six stone water jars there for Jewish ceremonial washings, each holding twenty to thirty gallons. Jesus told them, "Fill the jars with water." So they filled them to the brim. Then he told them, "Draw some out now and take it to the headwaiter." So they took it. And when the headwaiter tasted the water that had become wine, without knowing where it came from (although the servers who had drawn the water knew), the headwaiter called the bridegroom and said to him, "Everyone serves good wine first, and then when people have drunk freely, an inferior one; but you have kept the good wine until now."'),
('luminous_2', 'John 2:11 (NABRE)', 'Jesus did this as the beginning of his signs in Cana in Galilee and so revealed his glory, and his disciples began to believe in him.');

-- 3. The Proclamation of the Kingdom (luminous_3)
INSERT INTO readings (mystery_id, reference, text) VALUES
('luminous_3', 'Mark 1:14-15 (NABRE)', 'After John had been arrested, Jesus came to Galilee proclaiming the gospel of God: "This is the time of fulfillment. The kingdom of God is at hand. Repent, and believe in the gospel."'),
('luminous_3', 'Matthew 4:17 (RSVCE)', 'From that time Jesus began to preach, saying, "Repent, for the kingdom of heaven is at hand."'),
('luminous_3', 'Matthew 5:3, 10 (RSVCE) – Beatitudes', 'Blessed are the poor in spirit, for theirs is the kingdom of heaven. Blessed are those who are persecuted for righteousness'' sake, for theirs is the kingdom of heaven.');

-- 4. The Transfiguration (luminous_4)
INSERT INTO readings (mystery_id, reference, text) VALUES
('luminous_4', 'Matthew 17:1-5 (NRSVCE)', 'Six days later, Jesus took with him Peter and James and his brother John and led them up a high mountain, by themselves. And he was transfigured before them, and his face shone like the sun, and his clothes became dazzling white. Suddenly there appeared to them Moses and Elijah, talking with him. Then Peter said to Jesus, "Lord, it is good for us to be here; if you wish, I will make three dwellings here, one for you, one for Moses, and one for Elijah." While he was still speaking, suddenly a bright cloud overshadowed them, and from the cloud a voice said, "This is my Son, the Beloved; with him I am well pleased; listen to him!"'),
('luminous_4', 'Matthew 17:6-8 (NRSVCE)', 'When the disciples heard this, they fell to the ground and were overcome by fear. But Jesus came and touched them, saying, "Get up and do not be afraid." And when they looked up, they saw no one except Jesus himself alone.');

-- 5. The Institution of the Eucharist (luminous_5)
INSERT INTO readings (mystery_id, reference, text) VALUES
('luminous_5', 'Matthew 26:26-28 (NABRE)', 'While they were eating, Jesus took bread, said the blessing, broke it, and giving it to his disciples said, "Take and eat; this is my body." Then he took a cup, gave thanks, and gave it to them, saying, "Drink from it, all of you, for this is my blood of the covenant, which will be shed on behalf of many for the forgiveness of sins."'),
('luminous_5', 'Matthew 26:29 (NABRE)', 'I tell you, from now on I shall not drink this fruit of the vine until the day when I drink it with you new in the kingdom of my Father.'),
('luminous_5', 'Meditation', 'St. John Chrysostom: "It is not man that causes the things offered to become the Body and Blood of Christ, but he who was crucified for us, Christ himself. The priest, in the role of Christ, pronounces these words, but their power and grace are God''s. This is my body, he says. This word transforms the things offered."'),
('luminous_5', '1 Corinthians 11:26 (RSVCE)', 'For as often as you eat this bread and drink the cup, you proclaim the Lord''s death until he comes.');
