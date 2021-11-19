function bit(shift: number): number {
    return 1 << shift;
}

export enum CSFlag {
    MAY_TALK_WHEN_DEAD = bit(0),
    SLAY_PLAYER = bit(1),
    CHANGE_NAME = bit(2),
    SILENCE_BAN_LIMITED = bit(3), // ?
    CT_BAN_LIMITED = bit(4),
    INVISIBLE_SPECTATOR_MODE = bit(5),
    KICK_PLAYER = bit(6),
    SLAP_PLAYER_LIMITED = bit(7),
    BEACON = bit(8),
    RESTART_ROUND = bit(9), // use ONLY in emergency case (e.g. bug)
    NORMAL_VIP = bit(10),
    EXTRA_VIP = bit(11),
    CMD_GRAB = bit(12),
    CMD_NOCLIP = bit(13),
    CMD_OPENDOORS = bit(14),
    NORMAL_BAN_LIMITED = bit(15),
    RESERVATION = bit(16)
}

export enum WebFlag {
    SHOW_COMPLAINTS_ABOUT_HIM = bit(0),
    RESPOND_TO_COMPLAINTS_ABOUT_PLAYERS = bit(1),
    MAKE_FINAL_VERDICT_OF_COMPLAINTS_ABOUT_PLAYERS = bit(2),
    RESPOND_TO_COMPLAINTS_ABOUT_SUPPORT = bit(3),
    SILENCE_BAN_LIMITED = bit(4),
    CT_BAN_LIMITED = bit(5),
    RESPOND_TO_COMPLAINTS_ABOUT_ADMIN = bit(6),
    RESPOND_TO_RECRUITMENT = bit(7),
    MAKE_FINAL_VERDICT_OF_COMPLAINTS_ABOUT_ADMINS = bit(8),
    MODIFY_VIP_STEAMID = bit(9),
    MODIFY_VIP_DISCORD = bit(10),
    MODIFY_SILENCE_BAN = bit(11),
    CANCEL_SILENCE_BAN = bit(12),
    MODIFY_ADMIN_INFO = bit(13), // SteamID / nickname / discord
    ADD_NEW_CONTENT = bit(14),
    MODIFY_ADMIN_FLAGS = bit(15),
    MAKE_FINAL_VERDICT_OF_RECRUITMENT = bit(16),
    MODIFY_RULES = bit(17)
}

export enum DiscordFlag {
    WARN = bit(0), // !warn @meno "reason"
    CLEAR = bit(1),
    TEMPORARY_MUTE = bit(2),
    SEE_INFRACTIONS = bit(3),
    CHANGE_NAME = bit(4),
    MOVE_USER = bit(5),
    PREDNOSTNI_MLUVCI = bit(6), // ?
    ACCESS_TEMPLAR_ROOMS = bit(7),
    SEE_AUDIT_LOG = bit(8),
    TAG_EVERYONE = bit(9), // @every
    TAG_HERE = bit(10), // @here
    TAG_ANY_ROLE = bit(11),
    MUTE_USER_MIC = bit(12),
    MUTE_USER_SOUND = bit(13),
    MAY_USE_LINKS = bit(14)
}

export class FlagsManager {
    public constructor(csFlags: number, webFlags: number, dcFlags: number) {
        this.mCSFlags = csFlags;
        this.mWebFlags = webFlags;
        this.mDCFlags = dcFlags;
    }

    public hasCSFlags(...flags: CSFlag[]): boolean {
        let finalFlags = 0;
        for (const flag of flags) {
            finalFlags |= flag;
        }

        return (finalFlags & this.mCSFlags) === finalFlags;
    }

    public hasWebFlags(...flags: WebFlag[]): boolean {
        let finalFlags = 0;
        for (const flag of flags) {
            finalFlags |= flag;
        }

        return (finalFlags & this.mWebFlags) === finalFlags;
    }

    public hasDCFlags(...flags: DiscordFlag[]): boolean {
        let finalFlags = 0;
        for (const flag of flags) {
            finalFlags |= flag;
        }

        return (finalFlags & this.mDCFlags) === finalFlags;
    }

    private readonly mCSFlags: number;
    private readonly mWebFlags: number;
    private readonly mDCFlags: number;
}