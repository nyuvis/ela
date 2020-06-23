const colors = {
    border: "#ccc",
    primary: "#4886FD",
    lightPrimary: "#DBE5FF",
    veryLightPrimary: "#F5F8FF",
    font: "#555",
    secondary: "#C37AFD",
    terciary: "#FF9E00",
    shade: "#eee",
    text: "#939393",
    background: "#FFFFFF",
    secondaryBackground: "#FDFCFC",
    remove: "#d55"
};

const sizes = {
    base: 1,
    border: 1,
    padding: 10,
    paddingLarge: 20,
    font: 13,
    fontTitle: 2, //em
    fontSubTitle: 1.3, //em
    fontTopicHeader: 1.3 //em
};

const vizString = {
    scoreColor: ["#C70A00", "#999", "#009E9E"],
    Corpus: "#e4e4e4",
    Map: "#c37afd",
    //Word: "#69cdf3",
    Word: "red",
    WordCovered: "#458096",
    //Topic: "#ff9e00",
    Topic: "#69cdf3",
    WordTopic: "#ff9e00",
    TopicBackground: "#ffd083"
};

const font = {
    family: "helvetica",
    defaultSize: 13,
    color: colors.font
};

export default {
    colors,
    sizes,
    font,
    vizString
};
