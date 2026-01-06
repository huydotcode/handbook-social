export interface VideoCallUser {
    _id: string;
    name: string;
    avatar?: string;
}

export interface VideoCallInitiateData {
    conversationId: string;
    targetUserId: string;
    isVideoCall: boolean;
}

export interface VideoCallOfferData {
    callId: string;
    targetUserId: string;
    offer: RTCSessionDescriptionInit;
}

export interface VideoCallAnswerData {
    callId: string;
    targetUserId: string;
    answer: RTCSessionDescriptionInit;
}

export interface VideoCallIceCandidateData {
    callId: string;
    targetUserId: string;
    candidate: RTCIceCandidateInit;
}

export interface VideoCallEventHandlers {
    onCallInitiated?: (data: { callId: string; status: string }) => void;
    onIncomingCall?: (data: {
        callId: string;
        conversationId: string;
        isVideoCall: boolean;
        initiator: VideoCallUser;
    }) => void;
    onCallAccepted?: (data: {
        callId: string;
        participants: Array<{
            userId: string;
            isVideoEnabled: boolean;
            isAudioEnabled: boolean;
        }>;
    }) => void;
    onCallRejected?: (data: { callId: string; rejectedBy: string }) => void;
    onCallEnded?: (data: { callId: string; endedBy: string }) => void;
    onCallError?: (data: { error: string }) => void;
    onWebRTCOffer?: (data: {
        callId: string;
        fromUserId: string;
        offer: RTCSessionDescriptionInit;
    }) => void;
    onWebRTCAnswer?: (data: {
        callId: string;
        fromUserId: string;
        answer: RTCSessionDescriptionInit;
    }) => void;
    onWebRTCIceCandidate?: (data: {
        callId: string;
        fromUserId: string;
        candidate: RTCIceCandidateInit;
    }) => void;
    onParticipantJoined?: (data: { callId: string; userId: string }) => void;
    onParticipantLeft?: (data: { callId: string; userId: string }) => void;
}
