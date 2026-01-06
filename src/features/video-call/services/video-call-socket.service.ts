import { socketEvent } from '@/shared/constants';
import { Socket } from 'socket.io-client';
import {
    VideoCallAnswerData,
    VideoCallEventHandlers,
    VideoCallIceCandidateData,
    VideoCallInitiateData,
    VideoCallOfferData,
} from '../types/video-call.types';

class VideoCallSocketServiceClass {
    private socket: Socket | null = null;
    private handlers: VideoCallEventHandlers = {};

    /**
     * Initialize the service with socket instance
     */
    initialize(socket: Socket) {
        this.socket = socket;
        this.setupEventListeners();
    }

    /**
     * Set event handlers for video call events
     */
    setEventHandlers(handlers: VideoCallEventHandlers) {
        this.handlers = { ...this.handlers, ...handlers };
    }

    /**
     * Setup socket event listeners
     */
    private setupEventListeners() {
        if (!this.socket) return;

        // Call initiated successfully
        this.socket.on(socketEvent.VIDEO_CALL_INITIATED, (data) => {
            this.handlers.onCallInitiated?.(data);
        });

        // Incoming call
        this.socket.on(socketEvent.VIDEO_CALL_INITIATE, (data) => {
            this.handlers.onIncomingCall?.(data);
        });

        // Call accepted
        this.socket.on(socketEvent.VIDEO_CALL_ACCEPT, (data) => {
            this.handlers.onCallAccepted?.(data);
        });

        // Call rejected
        this.socket.on(socketEvent.VIDEO_CALL_REJECT, (data) => {
            this.handlers.onCallRejected?.(data);
        });

        // Call ended
        this.socket.on(socketEvent.VIDEO_CALL_END, (data) => {
            this.handlers.onCallEnded?.(data);
        });

        // Call error
        this.socket.on(socketEvent.VIDEO_CALL_ERROR, (data) => {
            this.handlers.onCallError?.(data);
        });

        // WebRTC signaling events
        this.socket.on(socketEvent.VIDEO_CALL_OFFER, (data) => {
            this.handlers.onWebRTCOffer?.(data);
        });

        this.socket.on(socketEvent.VIDEO_CALL_ANSWER, (data) => {
            this.handlers.onWebRTCAnswer?.(data);
        });

        this.socket.on(socketEvent.VIDEO_CALL_ICE_CANDIDATE, (data) => {
            this.handlers.onWebRTCIceCandidate?.(data);
        });

        // Participant events
        this.socket.on(socketEvent.VIDEO_CALL_PARTICIPANT_JOINED, (data) => {
            this.handlers.onParticipantJoined?.(data);
        });

        this.socket.on(socketEvent.VIDEO_CALL_PARTICIPANT_LEFT, (data) => {
            this.handlers.onParticipantLeft?.(data);
        });
    }

    /**
     * Initiate a video/audio call
     */
    initiateCall(data: VideoCallInitiateData) {
        if (!this.socket) {
            console.error('Socket not initialized');
            return;
        }

        this.socket.emit(socketEvent.VIDEO_CALL_INITIATE, data);
    }

    /**
     * Accept an incoming call
     */
    acceptCall(callId: string) {
        if (!this.socket) {
            console.error('Socket not initialized');
            return;
        }

        this.socket.emit(socketEvent.VIDEO_CALL_ACCEPT, { callId });
    }

    /**
     * Reject an incoming call
     */
    rejectCall(callId: string) {
        if (!this.socket) {
            console.error('Socket not initialized');
            return;
        }

        this.socket.emit(socketEvent.VIDEO_CALL_REJECT, { callId });
    }

    /**
     * End an active call
     */
    endCall(callId: string) {
        if (!this.socket) {
            console.error('Socket not initialized');
            return;
        }

        this.socket.emit(socketEvent.VIDEO_CALL_END, { callId });
    }

    /**
     * Send WebRTC offer
     */
    sendOffer(data: VideoCallOfferData) {
        if (!this.socket) {
            console.error('Socket not initialized');
            return;
        }

        this.socket.emit(socketEvent.VIDEO_CALL_OFFER, data);
    }

    /**
     * Send WebRTC answer
     */
    sendAnswer(data: VideoCallAnswerData) {
        if (!this.socket) {
            console.error('Socket not initialized');
            return;
        }

        this.socket.emit(socketEvent.VIDEO_CALL_ANSWER, data);
    }

    /**
     * Send ICE candidate
     */
    sendIceCandidate(data: VideoCallIceCandidateData) {
        if (!this.socket) {
            console.error('Socket not initialized');
            return;
        }

        this.socket.emit(socketEvent.VIDEO_CALL_ICE_CANDIDATE, data);
    }

    /**
     * Cleanup event listeners
     */
    cleanup() {
        if (!this.socket) return;

        // Remove all video call event listeners
        this.socket.off(socketEvent.VIDEO_CALL_INITIATED);
        this.socket.off(socketEvent.VIDEO_CALL_INITIATE);
        this.socket.off(socketEvent.VIDEO_CALL_ACCEPT);
        this.socket.off(socketEvent.VIDEO_CALL_REJECT);
        this.socket.off(socketEvent.VIDEO_CALL_END);
        this.socket.off(socketEvent.VIDEO_CALL_ERROR);
        this.socket.off(socketEvent.VIDEO_CALL_OFFER);
        this.socket.off(socketEvent.VIDEO_CALL_ANSWER);
        this.socket.off(socketEvent.VIDEO_CALL_ICE_CANDIDATE);
        this.socket.off(socketEvent.VIDEO_CALL_PARTICIPANT_JOINED);
        this.socket.off(socketEvent.VIDEO_CALL_PARTICIPANT_LEFT);
    }

    /**
     * Check if socket is connected
     */
    isConnected(): boolean {
        return this.socket?.connected ?? false;
    }
}

export const videoCallSocketService = new VideoCallSocketServiceClass();
export default VideoCallSocketServiceClass;
