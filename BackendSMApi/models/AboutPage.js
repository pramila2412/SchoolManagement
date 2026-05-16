const mongoose = require('mongoose');

const aboutPageSchema = new mongoose.Schema({
    aboutUs: {
        title: { type: String, default: 'About Us' },
        subtitle: { type: String, default: 'Mount Zion School' },
        content: { type: String, default: '<p>Mount Zion School is a co-educational non-denominational (Christian) institution which is run by missionaries whose H.Q at Kerala, Mount Zion Welfare Society.</p><p style="margin-top: 8px;">It was established in 1994 and the purpose of starting this school was to give "Education to Everyone". From a humble beginning with the grace of God the school has now become a full-fledged institution. Mount Zion aims at educating different levels of students from different societies and communities and mould them in desired shapes. We give all the concerns for the scholastic and co-scholastic development of students by holding the core of the disciplinary steps. Apart from this the students are not only to excel in academic interests but also to understand that we all are made in the image of God, who wants to be fulfilled in life and work, in relationship with God, with each other and with the world He made for us to enjoy.</p>' },
        image: { type: String, default: '/About Us.png' },
        visitUrl: { type: String, default: 'https://www.facebook.com/share/1DYSZWV8DU/' }
    },
    rules: {
        title: { type: String, default: 'Rules & Regulations' },
        subtitle: { type: String, default: 'Mount Zion School' },
        content: { type: String, default: '<p style="margin-bottom: 20px;"><strong>MOUNT ZION SCHOOL</strong>, lays great stress on the development of character & conduct among the students and expects them to be worthy of highest standards of behaviour, individually & collectively in our lives. Courtesy, kindness, helpfulness and tolerance are virtues which they are particularly advised to cultivate. The following general rules of discipline should be observed strictly.</p><ol style="padding-left: 20px; margin: 0; list-style-type: decimal;"><li style="margin-bottom: 8px;">Children are strictly forbidden to go out of the school premises during school hours without permission of the Principal.</li><li style="margin-bottom: 8px;">Parents and Guardians are not allowed to see their wards or to visit teachers or to enter school verandah during school hours.</li><li style="margin-bottom: 8px;">Those who come on bicycle, should keep it at the cycle stand, properly locked.</li></ol>' },
        images: { type: [String], default: ['/rule1.jpg', '/rule2.jpg', '/rule3.jpg', '/rule4.jpg'] }
    },
    team: {
        title: { type: String, default: 'Our Team' },
        content: { type: String, default: '<p style="margin-bottom: 10px;">Mount Zion School is a Co-Educational English Medium School.</p><p>With its motto "Wisdom and Righteousness", we make every unremitting effort not only for academic performance but also for the physical, mental and intellectual development of our learners from various sectors of society by imparting quality education with self-discipline, self esteem and self confidence. Mount Zion School provides a safe and supportive environment to develop their skills for a future that reflects their highest aspiration and challenge to fly them as high as they can.</p>' },
        images: { type: [String], default: ['/Team1.png', '/Team2.png', '/Team3.png', '/Team4.png'] }
    },
    notices: {
        sectionTitle: { type: String, default: 'Notices' },
        image: { type: String, default: '/news1.png' },
        subtitle: { type: String, default: 'MOUNT ZION SCHOOL, PURNEA' },
        title: { type: String, default: 'SCHOOL CLOSED' },
        reason: { type: String, default: 'ON ACCOUNT OF MAKAR SANKRANTI FESTIVAL' },
        closureDate: { type: String, default: '14 January 2030 (Wednesday)' },
        reopeningDate: { type: String, default: 'School will reopen on 15 January 2030 (Thursday)' },
        infoText: { type: String, default: 'This is to inform parents and students that the school will remain closed on the above mentioned date due to the festival holiday.' }
    },
    schoolHours: {
        title: { type: String, default: 'INFORMATION ABOUT SCHOOL' },
        content: { type: String, default: `
            <div style="margin-top: 25px; border-top: 1px solid #e2e8f0; pt: 25px;">
                <p style="font-weight: 800; color: #000; margin-bottom: 15px; font-size: 0.9rem;">INFORMATION ABOUT SCHOOL</p>
                <p style="font-weight: 700; font-size: 0.85rem; margin-bottom: 10px;">SCHOOL HOURS:</p>
                
                <div style="margin-bottom: 20px;">
                    <p style="font-weight: 700; font-size: 0.85rem; margin-bottom: 5px;">DAY CLASS :</p>
                    <p style="margin: 0 0 4px 15px;">ASSEMBLY : 08:30 AM</p>
                    <p style="margin: 0 0 4px 30px; font-size: 0.8rem; color: #475569;">Prayer / Pledges / Songs / Scripture</p>
                    <p style="margin: 0 0 4px 15px;">CLASS : 08:45 AM to 02:15 PM</p>
                    <p style="margin: 0 0 4px 15px;">LUNCH BREAK: 11:25 AM to 11:50 AM</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <p style="font-weight: 700; font-size: 0.85rem; margin-bottom: 5px;">MORNING CLASS:</p>
                    <p style="margin: 0 0 4px 15px;">ASSEMBLY : 07:30 AM</p>
                    <p style="margin: 0 0 4px 15px;">CLASS : 07:45 AM to 01:15 PM</p>
                    <p style="margin: 0 0 4px 15px;">LUNCH BREAK: 10:35 AM to 11:00 AM</p>
                    <p style="margin: 10px 0 0 0; font-size: 0.8rem; font-style: italic;">Parents should take their child immediately when the class is Over.</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <p style="font-weight: 700; font-size: 0.85rem; margin-bottom: 5px;">TIME FOR SEEING THE PRINCIPAL</p>
                    <p style="margin: 0 0 4px 15px;">09:30 AM to 11:00 AM (Day Class)</p>
                    <p style="margin: 0 0 4px 15px;">08:30 AM to 10:00 AM (Morning Class)</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <p style="font-weight: 700; font-size: 0.85rem; margin-bottom: 5px;">TIME FOR SEEING THE TEACHER</p>
                    <p style="margin: 0 0 4px 15px;">Every Saturday after school hour with prior appointment through the school diary.</p>
                </div>
            </div>
        ` }
    }
}, { timestamps: true });

module.exports = mongoose.model('AboutPage', aboutPageSchema);
