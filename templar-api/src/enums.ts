import { BanType } from '.prisma/client';
import { VipMode } from '.prisma/client';

export function parseBanType(typeStr: string): BanType | undefined {
    if (typeStr === 'NORMAL') {
        return BanType.NORMAL;
    }
    if (typeStr === 'CT') {
        return BanType.CT;
    }
    if (typeStr === 'GAG') {
        return BanType.GAG;
    }
    if (typeStr === 'MUTE') {
        return BanType.MUTE;
    }

    return undefined;
}

export function parseVipMode(vipModeStr: string): VipMode | undefined {
    if (vipModeStr === VipMode.CLASSIC) {
        return VipMode.CLASSIC;
    }
    if (vipModeStr === VipMode.EXTRA) {
        return VipMode.EXTRA;
    }

    return undefined;
}
