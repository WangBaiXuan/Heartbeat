import { CircularProgress, InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
import { BOARD_TYPES, emailRegExp, ZERO, INIT_BOARD_FIELDS_STATE, EMAIL } from '@src/constants'
import React, { FormEvent, useEffect, useState } from 'react'
import {
  BoardButtonGroup,
  BoardForm,
  BoardLoadingDrop,
  BoardSection,
  BoardTextField,
  BoardTitle,
  BoardTypeSelections,
  ResetButton,
  VerifyButton,
} from '@src/components/Metrics/ConfigStep/Board/style'
import { useAppDispatch, useAppSelector } from '@src/hooks'
import { changeBoardVerifyState, isBoardVerified } from '@src/features/board/boardSlice'
import { selectBoardFields, updateBoardFields } from '@src/features/config/configSlice'
import { verifyBoard } from '@src/services/boardService'

export const Board = () => {
  const dispatch = useAppDispatch()
  const boardFields = useAppSelector(selectBoardFields)
  const isVerified = useAppSelector(isBoardVerified)
  const [fieldErrors, setFieldErrors] = useState(INIT_BOARD_FIELDS_STATE)
  const [isDisableVerifyButton, setIsDisableVerifyButton] = useState(true)
  const boardFieldValues = Object.values(boardFields)
  const boardFieldNames = Object.keys(boardFields)
  const boardFieldStates = Object.values(fieldErrors)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    dispatch(
      updateBoardFields({
        board: boardFields.board,
        boardId: '',
        email: '',
        projectKey: '',
        site: '',
        token: '',
      })
    )
  }, [boardFields.board])

  useEffect(() => {
    setIsDisableVerifyButton(
      !boardFieldNames
        .map((fieldName, index) => checkFiledValid(fieldName, boardFieldValues[index]))
        .every((validField) => validField)
    )
  }, [boardFields])

  const initBoardFields = () => {
    dispatch(
      updateBoardFields({
        board: BOARD_TYPES.JIRA,
        boardId: '',
        email: '',
        projectKey: '',
        site: '',
        token: '',
      })
    )
  }

  const checkFiledValid = (type: string, value: string): boolean =>
    type === EMAIL ? emailRegExp.test(value) : value !== ''

  const onFormUpdate = (key: string, value: string) => {
    const isError = !checkFiledValid(key, value)
    const newFieldErrors = {
      ...fieldErrors,
      [key]: {
        isError,
        helpText: isError ? ` ${key} is required` : '',
      },
    }
    setFieldErrors(newFieldErrors)
    dispatch(
      updateBoardFields({
        ...boardFields,
        [key]: value,
      })
    )
  }

  useEffect(() => {
    ;(async () => {
      const response = await verifyBoard()
      if (response.status === 200) {
        setIsLoading(false)
      }
    })()
  }, [isLoading])
  const handleSubmitBoardFields = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(changeBoardVerifyState(true))
    setIsLoading(true)
  }

  const handleResetBoardFields = () => {
    initBoardFields()
    setIsDisableVerifyButton(true)
    dispatch(changeBoardVerifyState(false))
  }

  return (
    <BoardSection>
      {isLoading && (
        <BoardLoadingDrop open={isLoading} data-testid='circularProgress'>
          <CircularProgress size='8rem' />
        </BoardLoadingDrop>
      )}
      <BoardTitle>board</BoardTitle>
      <BoardForm onSubmit={(e) => handleSubmitBoardFields(e)} onReset={handleResetBoardFields}>
        {boardFieldNames.map((filedName, index) =>
          index === ZERO ? (
            <BoardTypeSelections variant='standard' required key={boardFieldValues[index]}>
              <InputLabel id='board-type-checkbox-label'>board</InputLabel>
              <Select
                labelId='board-type-checkbox-label'
                value={boardFields.board}
                onChange={(e) => {
                  onFormUpdate('board', e.target.value)
                }}
              >
                {Object.values(BOARD_TYPES).map((data) => (
                  <MenuItem key={data} value={data}>
                    <ListItemText primary={data} />
                  </MenuItem>
                ))}
              </Select>
            </BoardTypeSelections>
          ) : (
            <BoardTextField
              key={index}
              required
              label={boardFieldNames[index]}
              variant='standard'
              value={boardFieldValues[index]}
              onChange={(e) => {
                onFormUpdate(filedName, e.target.value)
              }}
              error={boardFieldStates[index].isError}
              helperText={boardFieldStates[index].helpText}
            />
          )
        )}
        <BoardButtonGroup>
          <VerifyButton type='submit' disabled={isDisableVerifyButton}>
            {isVerified ? 'Verified' : 'Verify'}
          </VerifyButton>
          {isVerified && <ResetButton type='reset'>Reset</ResetButton>}
        </BoardButtonGroup>
      </BoardForm>
    </BoardSection>
  )
}
