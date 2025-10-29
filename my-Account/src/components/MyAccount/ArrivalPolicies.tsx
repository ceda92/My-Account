import React from "react";
import { ReactComponent as PoliciesIcon } from "../../assets/icons/policiesIcon.svg";
import { Label } from "../ui/label";
import { ReactComponent as CheckInOutIcon } from "../../assets/icons/checkIn-Out.svg";
import { TimePickerDemo } from "../ui/time-picker";
import { ReactComponent as ArrowPointer } from "../../assets/icons/arrowPointer.svg";
import Input from "../ui/Input";
import dayjs from "dayjs";
import { ReactComponent as ClockICon } from "../../assets/icons/clockIcon.svg";
import { ReactComponent as ArrowRightIcon } from "../../assets/icons/arrowRight.svg";
import { ReactComponent as OneManIcon } from "../../assets/icons/oneManIcon.svg";

interface ArrivalProps {
  startTime: dayjs.Dayjs | null;
  endTime: dayjs.Dayjs | null;
  minimumAge: string;
  leadTime: string;

  setStartTime: (value: dayjs.Dayjs | null) => void;
  setEndTime: (value: dayjs.Dayjs | null) => void;
  setMinimumAge: (value: string) => void;
  setLeadTime: (value: string) => void;

  onStateChange: () => void;

  ageError?: string;
  timeError?: string;
  leadTimeError?: string;
}

function ArrivalPolicies({
  startTime,
  endTime,
  minimumAge,
  leadTime,
  setStartTime,
  setEndTime,
  setMinimumAge,
  setLeadTime,
  onStateChange,
  ageError,
  timeError,
  leadTimeError,
}: ArrivalProps) {
  const handleStartTimeChange = (newStartTime: dayjs.Dayjs | null) => {
    setStartTime(newStartTime);

    onStateChange();
  };

  const handleEndTimeChange = (newEndTime: dayjs.Dayjs | null) => {
    setEndTime(newEndTime);
    onStateChange();
  };

  const handleMinimumAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMinimumAge(value);
    onStateChange();
  };

  const handleLeadTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setLeadTime(value);
    onStateChange();
  };

  return (
    <>
      <div className="h-full w-full rounded-lg bg-white pb-4 text-lg text-dark-blue shadow-lg">
        <h1 className="flex w-full gap-4 rounded-t-lg bg-gradient-to-r from-lime-green via-dark-blue-600 to-dark-blue py-1 text-white">
          <PoliciesIcon className="ml-2 mt-1 h-6 w-6" />
          Policies
        </h1>

        <div className="px-3">
          <div className="my-3 text-lg font-semibold text-lime-green">
            Arrival Departure Policy
          </div>

          <div className="flex">
            <div className="flex flex-col">
              <Label className="font-semibold text-dark-blue">
                Check in / Check out time
              </Label>

              <div>
                <div className="flex items-center">
                  <CheckInOutIcon className="h-14 w-14" />
                  <TimePickerDemo
                    date={startTime ? startTime.toDate() : undefined}
                    setDate={(date) =>
                      handleStartTimeChange(date ? dayjs(date) : null)
                    }
                  />

                  <ArrowPointer className="m-2 mt-3 h-6 w-6" />

                  <div className="mr-12">
                    <TimePickerDemo
                      date={endTime ? endTime.toDate() : undefined}
                      setDate={(date) =>
                        handleEndTimeChange(date ? dayjs(date) : null)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <Label className="font-semibold text-dark-blue">
                Lead Time *
              </Label>

              <div>
                <div className="flex rounded-lg border-lime-green">
                  <ClockICon className="mt-2 h-8 w-8" />
                  <ArrowRightIcon className="ml-3 mr-2 mt-2 h-6 w-6" />
                  <div className="relative w-20">
                    <Input
                      type="number"
                      value={leadTime}
                      onChange={handleLeadTimeChange}
                      placeholder="0"
                    />
                    <span className="absolute right-2 top-1/2 mr-8 mt-[0.075rem] -translate-y-1/2 text-sm">
                      h
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {timeError && (
            <p className="flex items-center gap-1 text-sm text-red-500">
              {timeError}
            </p>
          )}

          <div>
            <Label className="font-semibold text-lime-green">
              Age Policies
            </Label>
          </div>
          <div>
            <Label className="font-semibold text-dark-blue">
              Minimum Check in age Policy *
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <OneManIcon className="h-6 w-6" />

            <Input
              value={minimumAge}
              onChange={handleMinimumAgeChange}
              type="number"
              className={`${ageError ? "border-red-500 bg-red-50" : ""} mr-3`}
            />
          </div>
        </div>
        {ageError && (
          <p className="ml-2 mt-1 flex items-center gap-1 text-sm text-red-500">
            {ageError}
          </p>
        )}
      </div>
    </>
  );
}

export default ArrivalPolicies;
