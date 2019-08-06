import { IUser, IProject } from 'uehue.models';
import { Document } from 'mongoose'

export interface DocumentUser extends Document, IUser {}

export interface DocumentProject extends Document, IProject {}
