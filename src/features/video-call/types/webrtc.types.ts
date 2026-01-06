export interface WebRTCEventHandlers {
    onLocalStream?: (stream: MediaStream) => void;
    onRemoteStream?: (stream: MediaStream) => void;
    onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
    onIceCandidate?: (candidate: RTCIceCandidate) => void;
    onRenegotiationNeeded?: (offer: RTCSessionDescriptionInit) => void;
    onError?: (error: Error) => void;
    onIceConnectionStateChange?: (state: RTCIceConnectionState) => void;
}

export interface ICEServerConfig {
    urls: string | string[];
    username?: string;
    credential?: string;
}
