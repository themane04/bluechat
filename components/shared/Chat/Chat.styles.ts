import {StyleSheet} from 'react-native';
import {theme} from "../../../utils/styles/theme.ts";

export default StyleSheet.create({
    chatContainer: {
        alignItems: 'center',
        height: 100,
        width: '100%',
        padding: '5%',
        flexDirection: 'row',
        position: 'relative',
    },
    chatImage: {
        width: 50,
        height: 50,
        borderRadius: 18,
        marginRight: '5%',
        backgroundColor: theme.colors.brandColorDefault,
    },
    avatarText: {
        ...theme.typography.bodyText1,
        fontWeight: 'bold',
        color: 'white',
        position: 'absolute',
        marginLeft: 18,
        left: '5%',
    },
    chatTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    userNameText: {
        ...theme.typography.bodyText1,
        color: 'white',
    },
    statusText: {
        ...theme.typography.metadata1,
        color: 'gray',
        fontSize: 12,
        fontFamily: theme.typography.bodyText1.fontFamily,
    }
});
