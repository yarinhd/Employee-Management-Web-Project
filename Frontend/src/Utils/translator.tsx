import i18next from 'i18next';

i18next.init({
    lng: 'en', // if you're using a language detector, do not define the lng option
    debug: true,
    resources: {
        en: {
            translation: {
                username: 'שם משתמש',
                fullName: 'שם מלא',
                rank: 'דרגה',
                job: 'תפקיד',
                gender: 'מגדר',
                inGroup: 'קבוצה',
                serviceEndDate: 'תאריך סיום שירות',
            },
        },
    },
});
// initialized and ready to go!
// i18next is already initialized, because the translation resources where passed via init function
